import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  static login = async (req: Request, res: Response): Promise<any> => {
    const service: AuthService = new AuthService(req, res);

    try {
      await service.postLogin();
    } catch (error) {
      console.log(error);
    }
  };
}

export default AuthController;
