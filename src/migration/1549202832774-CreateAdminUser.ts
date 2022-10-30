import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Com_user } from "../entity/Com_user";
import { Md_product } from "../entity/Md_product";
import helper from "../helpers/function";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = [
      {
        user: new Com_user(),
        user_id: 1,
        user_name: "rahmadz",
        user_email: "yaelahferr@gmail.com",
        user_username: "rahmadz",
        user_password: await helper.passwordHash("rahmadz"),
      },
    ];
    const userRepository = await getRepository(Com_user);
    await userRepository.save(user);

    let product = [
      {
        product: new Md_product(),
        prod_id: 1,
        prod_name: "Samsung Galaxy S9",
        prod_desc:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        prod_amount: 200000,
        prod_stock: 5,
      },
      {
        product: new Md_product(),
        prod_id: 2,
        prod_name: "Iphone X",
        prod_desc:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        prod_amount: 300000,
        prod_stock: 5,
      },
      {
        product: new Md_product(),
        prod_id: 3,
        prod_name: "Sony Xperia XZ",
        prod_desc:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        prod_amount: 400000,
        prod_stock: 5,
      },
      {
        product: new Md_product(),
        prod_id: 4,
        prod_name: "Xiaomi Xuz8",
        prod_desc:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        prod_amount: 500000,
        prod_stock: 5,
      },
      {
        product: new Md_product(),
        prod_id: 5,
        prod_name: "Nexian",
        prod_desc:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        prod_amount: 200000,
        prod_stock: 5,
      },
    ];
    const productRepository = await getRepository(Md_product);
    await productRepository.save(product);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
