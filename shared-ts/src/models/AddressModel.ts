import { Model } from "@/Model";
import { IsNotEmpty, IsString } from "class-validator";

export class AddressModel extends Model {
	@IsNotEmpty()
	line1 = "";

	@IsString()
	line2? = "";

	@IsNotEmpty()
	city = "";

	@IsNotEmpty()
	state = "";

	@IsNotEmpty()
	zip = "";
}
