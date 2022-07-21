import { Request, Response } from "express";
import { Public } from "../utils/decorators/Public.decorator";
import { Roles } from "../utils/decorators/Roles.decorator";
import { Role } from "../utils/enums/Roles.enum";
import PassportController from "./Passport.controller";

class SessionController {
  @Roles(Role.ADMIN)
  public get(req: Request, res: Response): void {
    res.json({
      message: "GET",
    });
  }

  @Public()
  public post(req: Request, res: Response, next): void {
    return new PassportController().signWithLocalStrategy(req, res, next);
  }
}

export default SessionController;
