import { Request, Response } from "express";
import GiftService from "../services/GiftService";

class GiftController {
  static gift = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.getGift();
    } catch (error) {
      console.log(error);
    }
  };

  static add = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.postGift();
    } catch (error) {
      console.log(error);
    }
  };

  static detail = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.getDetail();
    } catch (error) {
      console.log(error);
    }
  };

  static redeem = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.postRedeem();
    } catch (error) {
      console.log(error);
    }
  };

  static rating = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.postRating();
    } catch (error) {
      console.log(error);
    }
  };

  static delete = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.deleteGift();
    } catch (error) {
      console.log(error);
    }
  };

  static patch = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.patchGift();
    } catch (error) {
      console.log(error);
    }
  };

  static put = async (req: Request, res: Response): Promise<any> => {
    const service: GiftService = new GiftService(req, res);

    try {
      await service.putGift();
    } catch (error) {
      console.log(error);
    }
  };
}

export default GiftController;
