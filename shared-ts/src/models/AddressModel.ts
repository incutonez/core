import { Model } from "@/Model";
import { IsNotEmpty } from "class-validator";

export class AddressModel extends Model {
	@IsNotEmpty()
	line1 = "";

	line2? = "";

	@IsNotEmpty()
	city = "";

	@IsNotEmpty()
	state = "";

	@IsNotEmpty()
	zip = "";
}
