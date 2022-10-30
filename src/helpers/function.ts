require("dotenv/config");
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

class Function {
  public static passwordHash = (password: string): Promise<string> => {
    return bcrypt.hash(password, 8);
  };

  public static passwordCompare = async (
    text: string,
    encryptedText: string
  ): Promise<boolean> => {
    let result = await bcrypt.compare(text, encryptedText);
    return result;
  };

  public static generateToken = (
    user_id: number,
    name: string,
    email: string
  ): string => {
    const secretKey: string = process.env.TOKEN_SECRET || "secret";

    const token: string = jwt.sign({ user_id, name, email }, secretKey, {
      expiresIn: "24h",
    });
    return token;
  };

  public static generatechar = (length: any): any => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  public static isInt = (value: any): any => {
    var x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  };

  public static sortFunction = (a: any, b: any): any => {
    var dateA = new Date(a.mdb).getTime();
    var dateB = new Date(b.mdb).getTime();
    return dateA > dateB ? 1 : -1;
  };

  public static formatDate = (date: any): any => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  public static mergeArray = (arr1: any, arr2: any) => {
    return arr1.map((item, i) => {
      if (item.id === arr2[i].id) {
        return Object.assign({}, item, arr2[i]);
      }
    });
  };
}

export default Function;
