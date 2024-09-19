from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from database import subscribers_collection, newsletters_collection

app = FastAPI()

def objectid_to_str(obj):
    return str(obj) if obj else None

def str_to_objectid(obj):
    return ObjectId(obj) if obj else None

def datetime_to_str(dt):
    return dt.isoformat() if dt else None

def str_to_datetime(date_str):
    return datetime.fromisoformat(date_str) if date_str else None

def datetime_to_str(dt):
    return dt.strftime("%Y-%m-%dT%H:%M:%S") if dt else None

class Subscriber(BaseModel):
    name: str
    address: str
    email: str
    password: str

class Newsletter(BaseModel):
    subject: str
    content: str
    sendDate: datetime
    subscriber: Optional[str] = None  # Make this field optional

class SubscriberInDB(Subscriber):
    id: str = Field(default=None)

class NewsletterInDB(Newsletter):
    id: str = Field(default=None)

@app.post("/subscribers/", response_model=SubscriberInDB)
async def create_subscriber(subscriber: Subscriber):
    subscriber_data = subscriber.dict()
    result = await subscribers_collection.insert_one(subscriber_data)
    subscriber_data["id"] = objectid_to_str(result.inserted_id)
    return SubscriberInDB(**subscriber_data)

@app.get("/subscribers/", response_model=List[SubscriberInDB])
async def get_subscribers():
    subscribers = await subscribers_collection.find().to_list(100)
    return [SubscriberInDB(**{**sub, "id": objectid_to_str(sub["_id"])}) for sub in subscribers]

@app.get("/subscribers/{subscriber_id}", response_model=SubscriberInDB)
async def get_subscriber(subscriber_id: str):
    subscriber = await subscribers_collection.find_one({"_id": ObjectId(subscriber_id)})
    if subscriber is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    subscriber["id"] = objectid_to_str(subscriber["_id"])
    return SubscriberInDB(**subscriber)


@app.put("/subscribers/{subscriber_id}", response_model=SubscriberInDB)
async def update_subscriber(subscriber_id: str, updated_subscriber: Subscriber):
    subscriber = await subscribers_collection.find_one({"_id": ObjectId(subscriber_id)})
    if subscriber is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")

    updated_subscriber_data = updated_subscriber.dict()
    result = await subscribers_collection.update_one(
        {"_id": ObjectId(subscriber_id)},
        {"$set": updated_subscriber_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update subscriber")

    updated_subscriber_data["id"] = subscriber_id
    return SubscriberInDB(**updated_subscriber_data)

@app.delete("/subscribers/{subscriber_id}", response_model=SubscriberInDB)
async def delete_subscriber(subscriber_id: str):
    subscriber = await subscribers_collection.find_one_and_delete({"_id": ObjectId(subscriber_id)})
    if subscriber is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    await newsletters_collection.delete_many({"subscriber": ObjectId(subscriber_id)})
    subscriber["id"] = objectid_to_str(subscriber["_id"])
    return SubscriberInDB(**subscriber)


@app.post("/newsletters/", response_model=NewsletterInDB)
async def create_newsletter(newsletter: Newsletter):
    newsletter_data = newsletter.dict()
    if newsletter_data.get("subscriber"):
        newsletter_data["subscriber"] = str_to_objectid(newsletter_data["subscriber"])
    print(newsletter_data["sendDate"])
    result = await newsletters_collection.insert_one(newsletter_data)
    newsletter_data["id"] = objectid_to_str(result.inserted_id)

    return NewsletterInDB(
        **{
            **newsletter_data,
            "sendDate": datetime_to_str(newsletter_data["sendDate"]),  # Convert datetime to string for response
            "subscriber": objectid_to_str(newsletter_data["subscriber"])
        }
    )

@app.get("/newsletters/", response_model=List[NewsletterInDB])
async def get_newsletters():
    newsletters = await newsletters_collection.find().to_list(100)
    return [
        NewsletterInDB(
            **{
                **news,
                "id": objectid_to_str(news["_id"]),
                "sendDate": datetime_to_str(news.get("sendDate")),  # Convert datetime to string for response
                "subscriber": objectid_to_str(news.get("subscriber"))
            }
        )
        for news in newsletters
    ]

@app.get("/newsletters/{newsletter_id}", response_model=NewsletterInDB)
async def get_newsletter(newsletter_id: str):
    newsletter = await newsletters_collection.find_one({"_id": ObjectId(newsletter_id)})
    if newsletter is None:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    newsletter["id"] = objectid_to_str(newsletter["_id"])
    newsletter["sendDate"] = datetime_to_str(newsletter.get("sendDate"))
    newsletter["subscriber"] = objectid_to_str(newsletter.get("subscriber"))
    return NewsletterInDB(**newsletter)


@app.put("/newsletters/{newsletter_id}", response_model=NewsletterInDB)
async def update_newsletter(newsletter_id: str, updated_newsletter: Newsletter):
    newsletter = await newsletters_collection.find_one({"_id": ObjectId(newsletter_id)})
    if newsletter is None:
        raise HTTPException(status_code=404, detail="Newsletter not found")

    updated_newsletter_data = updated_newsletter.dict()
    if updated_newsletter_data.get("subscriber"):
        updated_newsletter_data["subscriber"] = str_to_objectid(updated_newsletter_data["subscriber"])

    result = await newsletters_collection.update_one(
        {"_id": ObjectId(newsletter_id)},
        {"$set": updated_newsletter_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Failed to update newsletter")

    updated_newsletter_data["id"] = newsletter_id
    return NewsletterInDB(
        **{
            **updated_newsletter_data,
            "sendDate": datetime_to_str(updated_newsletter_data["sendDate"]),
            "subscriber": objectid_to_str(updated_newsletter_data["subscriber"])
        }
    )


@app.delete("/newsletters/{newsletter_id}", response_model=NewsletterInDB)
async def delete_newsletter(newsletter_id: str):
    newsletter = await newsletters_collection.find_one_and_delete({"_id": ObjectId(newsletter_id)})
    if newsletter is None:
        raise HTTPException(status_code=404, detail="Newsletter not found")
    newsletter["id"] = objectid_to_str(newsletter["_id"])
    newsletter["sendDate"] = datetime_to_str(newsletter.get("sendDate"))
    newsletter["subscriber"] = objectid_to_str(newsletter.get("subscriber"))
    return NewsletterInDB(**newsletter)


@app.get("/subscribers/{subscriber_id}/newsletters", response_model=List[NewsletterInDB])
async def get_newsletters_for_subscriber(subscriber_id: str):
    # Ensure the subscriber_id is a valid ObjectId
    subscriber_object_id = str_to_objectid(subscriber_id)
    if not subscriber_object_id:
        raise HTTPException(status_code=400, detail="Invalid subscriber ID")

    # Query the newsletters collection for newsletters where the subscriber field matches the subscriber_id
    newsletters = await newsletters_collection.find({"subscriber": subscriber_object_id}).to_list(100)

    # Convert newsletters data to the response model
    return [
        NewsletterInDB(
            **{
                **news,
                "id": objectid_to_str(news["_id"]),
                "sendDate": datetime_to_str(news.get("sendDate")),  # Convert datetime to string for response
                "subscriber": objectid_to_str(news.get("subscriber"))
            }
        )
        for news in newsletters
    ]