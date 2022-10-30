import { Request, Response } from "express";
import { getManager } from "typeorm";
import helper from "../helpers/function";
import AuthRepository from "../repository/AuthRepository";
import { Com_user } from "../entity/Com_user";
import response from "../helpers/response";

class AuthService {
  body: Request["body"];
  params: Request["params"];
  res: Response;
  req: any;

  constructor(req: any, res: Response) {
    this.body = req.body;
    this.params = req.params;
    this.res = res;
    this.req = req;
  }

  // Service Api

  postLogin = async () => {
    const AuthsRepository = getManager().getCustomRepository(AuthRepository);
    let user: Com_user;
    let compare: any;
    const { username, password } = this.body;
    if (!(username && password)) {
      return response.validation(
        "",
        "Username atau password tidak boleh kosong !",
        this.res
      );
    }
    try {
      user = await AuthsRepository.checkAuth(username);
      compare = await helper.passwordCompare(password, user[0].user_password);
    } catch (error) {
      return response.failed("", "Email atau password salah !", this.res);
    }
    if (compare) {
      let token = helper.generateToken(
        user[0].user_id,
        user[0].user_name,
        user[0].user_email
      );
      let data = {
        user_id: user[0].user_id,
        name: user[0].user_name,
        email: user[0].user_email,
        username: user[0].user_username,
        token: token,
      };
      return response.success(data, "Data Ditemukan !", this.res);
    }
    return response.failed("", "Email atau password salah !", this.res);
  };
}

export default AuthService;
