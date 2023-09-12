import type { NextApiRequest, NextApiResponse } from "next";
import { BlahajData, getBlahajData } from "../../lib/get-blahaj";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<BlahajData>,
) {
	res.status(200).json(await getBlahajData());
}
