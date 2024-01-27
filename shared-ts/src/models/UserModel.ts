import { Model } from "@/Model";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { AddressModel } from "@/models/AddressModel";
import { Type } from "class-transformer";

export class UserModel extends Model {
	@IsString()
	@IsOptional({
		groups: ["create"],
	})
	id = "";

	@IsString()
	@IsNotEmpty()
	username = "";

	@IsString()
	@IsNotEmpty()
	name = "";

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => AddressModel)
	address = AddressModel.create();
}
