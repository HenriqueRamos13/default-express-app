import { Request, Response } from "express";
import MailService from "../services/Mail.service";

class MailController {
  public post(req: Request, res: Response): void {
    MailService.sendMail();

    res.json({
      message: "POST",
    });
  }
}

export default MailController;
