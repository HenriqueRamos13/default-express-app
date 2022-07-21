import { Request, Response, Router } from "express";
import AuthService from "../services/Auth.service";
import { routeConfig } from "../utils/decorators/Route.decorator";
import METHOD from "../utils/enums/methods.enum";
import PassportController from "./Passport.controller";

class AuthController {
  @routeConfig({
    method: METHOD.POST,
    path: "/auth",
  })
  public post(req: Request, res: Response, next): void {
    return new PassportController().signup(req, res, next);
  }

  @routeConfig({
    method: METHOD.PUT,
    path: "/auth",
  })
  public put(req: Request, res: Response): void {
    res.json({
      message: "PUT",
    });
  }

  @routeConfig({
    method: METHOD.PATCH,
    path: "/auth",
  })
  public patch(req: Request, res: Response): void {
    res.json({
      message: "PATCH",
    });
  }

  @routeConfig({
    method: METHOD.DELETE,
    path: "/auth",
  })
  public delete(req: Request, res: Response): void {
    res.json({
      message: "DELETE",
    });
  }
}

export default AuthController;
