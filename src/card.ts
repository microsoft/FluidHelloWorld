export const ActionContentType: string = "adaptiveCard/action";

export interface AdaptiveCardAction {
    // statusCode: StatusCodes;
    type: string;
    id?: string;
    verb: string;
    data: any;
}
