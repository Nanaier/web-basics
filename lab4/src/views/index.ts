import { Request, Response } from "express";

// Головна сторінка
export const renderHomePage = (req: Request, res: Response) => {
  res.sendFile("index.html", { root: "public" });
};

// Сторінка підписників
export const renderSubscribersPage = (req: Request, res: Response) => {
  res.sendFile("subscribers.html", { root: "public" });
};

// Сторінка розсилок
export const renderNewslettersPage = (req: Request, res: Response) => {
  res.sendFile("newsletters.html", { root: "public" });
};
