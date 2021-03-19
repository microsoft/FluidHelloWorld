export const ActionContentType: string = "adaptiveCard/action";

export const AdaptiveCardContentType: string = "application/vnd.microsoft.card.adaptive";

export interface AdaptiveCardAction {
    // statusCode: StatusCodes;
    type: string;
    id?: string;
    verb: string;
    data: any;
}
