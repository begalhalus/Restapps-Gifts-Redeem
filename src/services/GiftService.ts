import { Request, Response } from "express";
import { getManager, getRepository } from "typeorm";
import GiftRepository from "../repository/GiftRepository";
import { Md_product } from "../entity/Md_product";
import { Com_user_reedem } from "../entity/Com_user_reedem";
import { Mg_rating } from "../entity/Mg_rating";
import response from "../helpers/response";
import moment = require("moment");
import lodash = require("lodash");

class GiftService {
  credential: {
    user_id: number;
  };
  body: Request["body"];
  params: Request["params"];
  res: Response;
  req: any;

  constructor(req: any, res: Response) {
    this.credential = req.app.locals.credential;
    this.body = req.body;
    this.params = req.params;
    this.res = res;
    this.req = req;
  }

  // Service Api

  getGift = async () => {
    const GiftsRepository = getManager().getCustomRepository(GiftRepository);
    const { sort, dir, search } = this.req.query;
    let gift: any;

    try {
      gift = await GiftsRepository.productList(sort, dir, search);
    } catch (error) {
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (gift.length) {
      let topicArray = gift.map(async (list, key) => {
        return await GiftsRepository.getRating(list.id);
      });

      let data = await Promise.all(topicArray);

      lodash.forEach(gift, async (list, key) => {
        list.rating = data[key];

        lodash.forEach(data[key], async (list, key) => {
          let tot_rated = list.total_review * 5;
          let rating = (list.tot_rate * 5) / tot_rated;
          list.rating = Math.round(rating / 0.5) * 0.5 || 0;

          delete list.tot_rate;
        });
      });

      return response.pagination(gift, "Data Ditemukan !", this.res, this.req);
    }

    return response.failed("", "Data Tidak Ditemukan !", this.res);
  };

  getDetail = async () => {
    const RatingsRepository = getManager().getCustomRepository(GiftRepository);
    const GiftsRepository = getRepository(Md_product);
    const { id } = this.req.params;
    let data: any;

    try {
      data = await GiftsRepository.findOne({
        prod_id: id,
      });
    } catch (error) {
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (data) {
      let rating = await RatingsRepository.getRating(data.prod_id);

      let tot_rated = rating[0].total_review * 5;
      let calc_rating = (rating[0].tot_rate * 5) / tot_rated;

      let result = {
        id: data.prod_id,
        title: data.prod_name,
        stock: data.prod_stock,
        amount: data.prod_amount,
        badge: data.prod_badge,
        description: data.prod_desc,
        rating: [
          {
            total_review: rating[0].total_review,
            rating: Math.round(calc_rating / 0.5) * 0.5 || 0,
          },
        ],
      };

      return response.success(result, "Data Ditemukan !", this.res);
    }

    return response.failed("", "Data Tidak Ditemukan !", this.res);
  };

  postRedeem = async () => {
    const GiftsRepository = getRepository(Md_product);
    const { id } = this.req.params;
    const { qty } = this.body;
    let gift: any;

    if (!(id && qty)) {
      return response.validation("", "Data tidak lengkap !", this.res);
    }

    try {
      gift = await GiftsRepository.findOne({
        prod_id: id,
      });
    } catch (error) {
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (qty > gift.prod_stock) {
      return response.failed("", "Maaf stock produck habis !", this.res);
    }

    if (gift) {
      let redeem = [
        {
          redeem: new Com_user_reedem(),
          user_id: this.credential.user_id,
          prod_id: gift.prod_id,
          qty: qty,
        },
      ];
      const redeemRepository = await getRepository(Com_user_reedem);
      let saveTransactions = await redeemRepository.save(redeem);

      if (saveTransactions) {
        let result = {
          id: saveTransactions[0].redeem_id,
          user_id: saveTransactions[0].user_id,
          prod_id: saveTransactions[0].prod_id,
          create_date: moment(saveTransactions[0].reedem_register).format(
            "dddd, DD MMMM YYYY"
          ),
          update_date: moment(saveTransactions[0].reedem_updated).format(
            "dddd, DD MMMM YYYY"
          ),
        };

        return response.success(
          result,
          "Selamat, Item berhasil diredeem !",
          this.res
        );
      }
    }

    return response.failed("", "Update Profil Gagal", this.res);
  };

  postRating = async () => {
    const RatingRepository = getRepository(Mg_rating);
    const ReedemRepository = getRepository(Com_user_reedem);
    const { id } = this.req.params;
    const { rating, redeem_id, desciption } = this.body;
    let checkExistingRating: any;

    if (!(id && rating && desciption && redeem_id)) {
      return response.validation("", "Data tidak lengkap !", this.res);
    }

    let checkedReedem = await ReedemRepository.findOne({
      redeem_id: redeem_id,
    });

    if (!checkedReedem) {
      return response.failed("", "Data Redeem tidak ditemukan !", this.res);
    }

    try {
      checkExistingRating = await RatingRepository.findOne({
        redeem_id: redeem_id,
      });
    } catch (error) {
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (!checkExistingRating) {
      let params = [
        {
          params: new Mg_rating(),
          redeem_id: redeem_id,
          user_id: this.credential.user_id,
          rating_desc: desciption,
          rating_value: rating,
        },
      ];
      const ratingRepository = await getRepository(Mg_rating);
      let saveRating = await ratingRepository.save(params);

      if (saveRating) {
        let result = {
          id: saveRating[0].rating_id,
          redeem_id: saveRating[0].redeem_id,
          user_id: saveRating[0].user_id,
          description: saveRating[0].rating_desc,
          rating: saveRating[0].rating_value,
          create_date: moment(saveRating[0].rating_register).format(
            "dddd, DD MMMM YYYY"
          ),
          update_date: moment(saveRating[0].rating_updated).format(
            "dddd, DD MMMM YYYY"
          ),
        };

        return response.success(result, "Item berhasil diulas !", this.res);
      }
    }

    return response.failed("", "Item sudah pernah diulas !", this.res);
  };

  postGift = async () => {
    const GiftsRepository = getRepository(Md_product);
    const { title, stock, amount, badge, description } = this.body;
    let gift: any;

    if (!(title && amount && description && stock)) {
      return response.validation("", "Data tidak lengkap !", this.res);
    }

    try {
      gift = await GiftsRepository.findOne({
        prod_name: title,
      });
    } catch (error) {
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (gift) {
      return response.failed("", "Maaf judul sudah terpakai !", this.res);
    }

    let params = [
      {
        params: new Md_product(),
        prod_name: title,
        prod_desc: description,
        prod_amount: amount,
        prod_stock: stock,
        prod_badge: badge,
      },
    ];

    let saveGift = await GiftsRepository.save(params);

    if (saveGift) {
      let data = {
        id: saveGift[0].prod_id,
        title: saveGift[0].prod_name,
        stock: saveGift[0].prod_stock,
        amount: saveGift[0].prod_amount,
        badge: saveGift[0].prod_badge,
        description: saveGift[0].prod_desc,
        create_date: moment(saveGift[0].prod_register).format(
          "dddd, DD MMMM YYYY"
        ),
        update_date: moment(saveGift[0].prod_updated).format(
          "dddd, DD MMMM YYYY"
        ),
      };

      return response.success(data, "Berhasil menambahkan data !", this.res);
    }
    return response.failed("", "Gagal menambahkan data !", this.res);
  };

  deleteGift = async () => {
    const GiftsRepository = getRepository(Md_product);
    const { id } = this.req.params;
    let gift: any;

    if (!id) {
      return response.validation("", "Data tidak lengkap !", this.res);
    }

    try {
      gift = await GiftsRepository.findOne({
        prod_id: id,
      });
    } catch (error) {
      console.log(error);
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (gift) {
      await GiftsRepository.delete({
        prod_id: id,
      });

      return response.success("", "Data berhasil dihapus", this.res);
    }

    return response.failed("", "Data tidak ditemukan", this.res);
  };

  patchGift = async () => {
    const GiftsRepository = getRepository(Md_product);
    const { id } = this.req.params;
    const { title, stock, amount, badge, description } = this.req.body;
    let gift: any;

    if (!id) {
      return response.validation("", "Data tidak lengkap !", this.res);
    }

    try {
      gift = await GiftsRepository.findOne({
        prod_id: id,
      });
    } catch (error) {
      console.log(error);
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (gift) {
      gift.prod_name = title ?? gift.prod_name;
      gift.prod_desc = description ?? gift.prod_desc;
      gift.prod_amount = amount ?? gift.prod_amount;
      gift.prod_stock = stock ?? gift.prod_stock;
      gift.prod_badge = badge ?? gift.prod_badge;

      let updateGift = await GiftsRepository.save(gift);

      let data = {
        id: updateGift.prod_id,
        title: updateGift.prod_name,
        stock: updateGift.prod_stock,
        amount: updateGift.prod_amount,
        badge: updateGift.prod_badge,
        description: updateGift.prod_desc,
        create_date: moment(updateGift.prod_register).format(
          "dddd, DD MMMM YYYY"
        ),
        update_date: moment(updateGift.prod_updated).format(
          "dddd, DD MMMM YYYY"
        ),
      };

      return response.success(data, "Data berhasil diupdate", this.res);
    }

    return response.failed("", "Data tidak ditemukan", this.res);
  };

  putGift = async () => {
    const GiftsRepository = getRepository(Md_product);
    const { id } = this.req.params;
    const { title, stock, amount, badge, description } = this.req.body;
    let gift: any;

    if (!(id && title && stock && amount && badge && description)) {
      return response.validation("", "Data tidak lengkap !", this.res);
    }

    try {
      gift = await GiftsRepository.findOne({
        prod_id: id,
      });
    } catch (error) {
      console.log(error);
      return response.failed("", "Maaf Server sedang bermasalah !", this.res);
    }

    if (gift) {
      gift.prod_name = title;
      gift.prod_desc = description;
      gift.prod_amount = amount;
      gift.prod_stock = stock;
      gift.prod_badge = badge;

      let updateGift = await GiftsRepository.save(gift);

      let data = {
        id: updateGift.prod_id,
        title: updateGift.prod_name,
        stock: updateGift.prod_stock,
        amount: updateGift.prod_amount,
        badge: updateGift.prod_badge,
        description: updateGift.prod_desc,
        create_date: moment(updateGift.prod_register).format(
          "dddd, DD MMMM YYYY"
        ),
        update_date: moment(updateGift.prod_updated).format(
          "dddd, DD MMMM YYYY"
        ),
      };

      return response.success(data, "Data berhasil diupdate", this.res);
    }

    return response.failed("", "Data tidak ditemukan", this.res);
  };
}

export default GiftService;
