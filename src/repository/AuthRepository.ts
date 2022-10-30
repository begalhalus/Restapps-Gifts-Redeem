import { EntityRepository, EntityManager, getRepository } from "typeorm";
import { Com_user } from "../entity/Com_user";

@EntityRepository(Com_user)
class AuthRepository {
  manage: EntityManager;
  repositoryUser: any;

  constructor(manage: EntityManager) {
    this.manage = manage;
    this.repositoryUser = getRepository(Com_user);
  }

  async checkAuth(email: string) {
    let data = this.manage.query(
      `SELECT a.* FROM com_user a WHERE (a.user_username='${email}') OR (a.user_email='${email}') LIMIT 1`
    );
    return data;
  }
}

export default AuthRepository;
