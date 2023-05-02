import { IInferValueTypes } from "../../utils/ts-utils";
import * as actions from "./actions";

export type IAction = ReturnType<IInferValueTypes<typeof actions>>;
