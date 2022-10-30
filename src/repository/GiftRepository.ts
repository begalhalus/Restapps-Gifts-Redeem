import { EntityRepository, EntityManager, getRepository } from "typeorm";
import { Com_user } from "../entity/Com_user";

@EntityRepository(Com_user)
class GiftRepository {
  manage: EntityManager;
  repositoryUser: any;

  constructor(manage: EntityManager) {
    this.manage = manage;
    this.repositoryUser = getRepository(Com_user);
  }

  async productList(sort: string, dir: string, search: string) {
    var query = `select a.prod_id as id, a.prod_name as title, a.prod_stock as stock, a.prod_amount as amount, a.prod_badge as badge FROM md_product a `;

    if (!sort) {
      sort = ` a.prod_id`;
    }

    if (!dir) {
      dir = ` ASC`;
    }

    if (search) {
      query += ` where a.prod_name ILIKE '%${search}%' `;
    }

    query += ` order by ${sort} ${dir} `;

    let data = this.manage.query(query);

    return data;
  }

  async getRating(prod_id: any) {
    let data = this.manage.query(
      `select COALESCE(SUM(a.rating_value)::int,0) AS tot_rate, (select count(a.rating_id)::int as total_review from mg_rating a INNER JOIN com_user_reedem b ON a.redeem_id = b.redeem_id WHERE b.prod_id IN (${prod_id}))  from mg_rating a INNER JOIN com_user_reedem b ON a.redeem_id = b.redeem_id WHERE b.prod_id IN (${prod_id})`
    );

    return data;
  }
}

export default GiftRepository;
