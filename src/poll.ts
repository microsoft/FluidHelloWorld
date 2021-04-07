export let pollCardTemplate = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
    "body": [
    // {
    //     "id": "active",
    //     "type": "TextBlock",
    //     "$when":"${equals(status, 'Active')}",
    //     "text": "${formatString(strings.dueByDate, ('' + dateString(action.expiryTime, 'SHORT') + ' ' + timeString(action.expiryTime)))}",
    //     "_text.comment": "due date if poll is active",
    //     "color": "default",
    //     "size": "small",
    //     "wrap": true
    // },
    {
        "id": "close",
        "type": "TextBlock",
        "$when":"${equals(status, 'Closed')}",
        "text": "${strings.PollClosed}",
        "color": "attention",
        "size": "small",
        "wrap": true
    },
    {
        "id": "expiry",
        "type": "TextBlock",
        "$when":"${equals(status, 'Expired')}",
        "text": "${strings.PollExpired}",
        "color": "attention",
        "size": "small",
        "wrap": true
    },
    // {
    //     "id": "ResultVisibility",
    //     "type": "TextBlock",
    //     "text": "${if(equals(action.dataTables[0].rowsVisibility, 'All'), strings.ResultEveryone, strings.ResultCreator)}",
    //     "maxLines": 2,
    //     "wrap": true,
    //     "isSubtle": true,
    //     "size": "small",
    //     "spacing": "none"
    // },
    {
        "id": "Title",
        "type": "TextBlock",
        "text": "${title}",
        "_$text.comment": "display poll title",
        "wrap": true,
        "weight": "bolder",
        "size": "large",
        "spacing": "small"
    },
    {
        "id": "Choices",
        "type": "Container",
        "style": "emphasis",
        "items": [
            {
                "id": "1616565651066.body.5.items.0",
                "type": "Input.ChoiceSet",
                "style": "expanded",
                "wrap": "true",
                "isMultiSelect": false,
                "choices": [
                    {
                        "$data": "${options}",
                       "title": "${displayName}",
                       "value": '{"optionsId":"${optionsId}", "displayName": "${displayName}"}'
                    }
                ]
            }
        ]
    },
    {
        "id": "Responder",
       // "$when": "${equals(action.dataTables[0].rowsVisibility, 'All')}",
        "type": "Container",
        "items": [
            {
                "id": "NoResponder",
                "type": "TextBlock",
                "$when": "${equals(count(responders), 0)}",
                "_$when.comment": "when no one responeded on poll",
                "text": "${strings.BeTheFirstOneToRespond}",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            },
            {
                "id": "OneResponded",
                "type": "TextBlock",
                "$when": "${equals(count(responders), 1)}",
                "_$when.comment": "when the count of responder is 1",
                "text": "${replace(strings.OneResponded, '{0}', responders[0].userId)}",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            },
            {
                "id": "TwoResponded",
                "type": "TextBlock",
                "$when": "${equals(count(responders), 2)}",
                "_$when.comment": "when the count of responders is 2",
                "text": "${replace(replace(strings.TwoResponded, '{0}', responders[0].userId), '{1}', responders[1].userId)}",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            },
            {
                "id": "ThreeResponded",
                "type": "TextBlock",
                "$when": "${equals(count(responders), 3)}",
                "_$when.comment": "when the count of responders is 3",
                "text": "${replace(replace(replace(strings.ThreeResponded, '{0}', responders[0].userId), '{1}', responders[1].userId), '{2}', responders[2].userId)}",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            },
            {
                "id": "FourResponded",
                "type": "TextBlock",
                "$when": "${equals(count(responders), 4)}",
                "_$when.comment": "when the count of responders is 4",
                "text": "${replace(replace(replace(strings.ThreeAndOneOtherResponded, '{0}', responders[0].userId), '{1}', responders[1].userId), '{2}', responders[2].userId)}",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            },
            {
                "id": "MoreResponded",
                "type": "TextBlock",
                "$when": "${greater(count(responders), 4)}",
                "_$when.comment": "when the count of responder is greater than 4",
                "text": "${replace(replace(replace(replace(strings.ThreeAndOthersResponded, '{0}', responders[0].userId), '{1}', responders[1].userId), '{2}', responders[2].userId), '{3}', string(sub(count(responders), 3)))}",
                "size": "small",
                "weight": "bolder",
                "maxLines": 2,
                "wrap": true,
                "spacing": "small"
            }
        ]
    }
],
"actions": [
    {
        "id": "update.responders.itemType.keys.basedOn.options",
       // "$when": "${equals(status, 'Active')}",
        "title": "${strings.Submit}",
        type: 'Action.Submit'
       // "command": "SubmitActionDataRow"
    },
    {
        "id": "Result",
        "title": "${strings.Results}",
        type: 'Action.Submit',
        // "command": "LaunchActionPackageView",
        //"parameters": {
        //    "viewName": "DetailView"
        //}
    }
]
};


export let pollStrings =  {
    "_Choice.comment": "{0} represent a number of choice",
    "ResultsVisibilitySettingsSummaryEveryone": "Results visible to everyone",
    "_ResultsVisibilitySettingsSummaryEveryone.comment": "Label to show when results visibilty is set to everyone",
    "ResultsVisibilitySettingsSummarySenderOnly": "Results visible to only me",
    "_ResultsVisibilitySettingsSummarySenderOnly.comment": "Label to show when results visibilty is set to the current user only",
    "DueInYears": "Due in {0} years",
    "_DueInYears.comment": "label to explain time remaining in years (plural)",
    "DueInYear": "Due in {0} year",
    "_DueInYear.comment": "label to explain time remaining in year (singular)",
    "DueInMonths": "Due in {0} months",
    "_DuenMonths.comment": "label to explain time remaining in months (plural)",
    "DueInMonth": "Due in {0} month",
    "_DuenMonth.comment": "label to explain time remaining in month (singular)",
    "DueInWeeks": "Due in {0} weeks",
    "_DueInWeeks.comment": "label to explain time remaining in weeks (plural)",
    "DueInWeek": "Due in {0} week",
    "_DueInWeek.comment": "label to explain time remaining in week (singular)",
    "DueInDays": "Due in {0} days",
    "_DueInDays.comment": "label to explain time remaining in days (plural)",
    "DueInDay": "Due in {0} day",
    "_DueInDay.comment": "label to explain time remaining in day (singular)",
    "DueInHoursAndMinutes": "Due in {0} hours, {1} minutes",
    "_DueInHoursAndMinutes.comment": "label to explain time remaining in hours and mintues (both plural)",
    "DueInHourAndMinutes": "Due in {0} hour, {1} minutes",
    "_DueInHourAndMinutes.comment": "label to explain time remaining in hour and mintues (singular hour and plural minutes)",
    "DueInHoursAndMinute": "Due in {0} hours, {1} minute",
    "_DueInHoursAndMinute.comment": "label to explain time remaining in hours and mintue (plural hours and singular mintues)",
    "DueInHourAndMinute": "Due in {0} hour, {1} minute",
    "_DueInHourAndMinute.comment": "label to explain time remaining in hours and mintue (both singular)",
    "DueInHours": "Due in {0} hours",
    "_DueInHours.comment": "label to explain time remaining in hours (plural)",
    "DueInHour": "Due in {0} hour",
    "_DueInHour.comment": "label to explain time remaining in hour (singular)",
    "DueInMinutes": "Due in {0} minutes",
    "_DueInMinutes.comment": "label to explain time remaining in mintues (plural)",
    "DueInMinute": "Due in {0} minute",
    "_DueInMinute.comment": "label to explain time remaining in mintue (singular)",
    "Send": "Send Poll",
    "_Send.comment": "label to show on the send button of poll creation page",
    "TitleBlankError": "Title cannot be left blank",
    "_TitleBlankError.comment": "Error message when somebody tries to send a poll without filling the title",
    "PollTitlePlaceholder": "Enter poll question",
    "_PollTitlePlaceholder.comment": "Poll Title Placeholder",
    "Settings": "Settings",
    "_Settings.comment": "Settings label to be shown next to settings section",
    "BlankChoiceError": "Choice cannot be left blank",
    "_BlankChoiceError.comment": "Error message when somebody tries to send a poll without filling the poll choice",
    "You": "You",
    "_You.comment": "You - pronoun",
    "YetToRespond": "{0} Yet To Respond",
    "_YetToRespond.comment": "{0} is placeholder for variable - do not localize. Its a number saying how many people are yet to respond",
    "ResponseFetchError": "Fetching Response Failed. Try again.",
    "_ResponseFetchError.comment": "Error message to be shown when fetch response API returns an error",
    "Back": "Back",
    "_Back.comment": "Back button label",
    "ViewResponses": "View Responses",
    "_ViewResponses.comment": "View Responses button label",
    "Download": "Download",
    "_Download.comment": "Download(verb) button label",
    "DownloadResponses": "Download CSV",
    "_DownloadResponses.comment": "Download CSV (csv as in .csv extension file) button label",
    "DownloadYourResponses": "Download Your Response",
    "_DownloadYourResponses.comment": "Download(verb) your responses button label",
    "DownloadImage": "Download Image",
    "_DownloadImage.comment": "Download(verb) Image button",
    "ClosedOn": "Closed on {0}",
    "_ClosedOn.comment": "Closed On as label. The placeholder {0} takes date and time",
    "ExpiredOn": "Expired on {0}",
    "_ExpiredOn.comment": "Expired On as label. The placeholder {0} takes date and time",
    "FeatureNotAvailable": "This feature is currently not available",
    "_FeatureNotAvailable.comment": "Feature Not Available error message",
    "OK": "OK",
    "_OK.comment": "Ok button label",
    "SelectADate": "Select a Date...",
    "_SelectADate.comment": "Select A Date ghost text",
    "SelectATime": "Select a Time...",
    "_SelectATime.comment": "Select a Time... as label for selecting Time",
    "SomethingWentWrong": "Something went wrong",
    "_SomethingWentWrong.comment": "generic error message",
    "ChangeDueDate": "Change due date",
    "_ChangeDueDate.comment": "Change due date as text. Here due is as in - due in 5 hours",
    "ChangeDate": "Change Date",
    "_ChangeDate.comment": "Change Date text",
    "ClosePoll": "Close Poll",
    "_ClosePoll.comment": "Close Poll button's label",
    "DeletePoll": "Delete Poll",
    "_DeletePoll.comment": "Delete Poll button text",
    "ClosePollConfirmation": "Are you sure you want to close this poll?",
    "_ClosePollConfirmation.comment": "Close poll confirmation message",
    "DeletePollConfirmation": "Are you sure you want to delete this poll?",
    "_DeletePollConfirmation.comment": "Delete poll confirmation message",
    "Participation": "Participation {0}%",
    "_Participation.comment": "string shown in results view participation widget",
    "BarPercentage": "{0}%",
    "_BarPercentage.comment": "String to show the percentage. Placeholder 0 is a number",
    "ParticipationIndicatorSingular": "{0} of {1} responded",
    "_ParticipationIndicatorSingular.comment": "Placeholder 0 expects number of participants who have responded and 1 expects the total number of participants. 0 expects singular, 1 expects plural number",
    "ParticipationIndicatorPlural": "{0} of {1} responded",
    "_ParticipationIndicatorPlural.comment": "Placeholder 0 expects number of participants who have responded and 1 expects the total number of participants. 0 and 1 both expect plural number",
    "Responders": "Responders",
    "_Responders.comment": "Responders as text",
    "NonResponders": "Yet to respond",
    "_NonResponders.comment": "Tab title for non responders view",
    "NotResponded": "You have not responded",
    "_NotResponded.comment": "Label shown in results view if the current user has not responded",
    "YourResponse": "Your response: {0}",
    "_YourResponse.comment": "text to be shown on results page. Placeholder contains the response of current user.",
    "VisibilityCreatorOnlyLabel": "Results visible only to sender of this poll",
    "_VisibilityCreatorOnlyLabel.comment": "Message for non creators when results visibilty in creator only",
    "Cancel": "Cancel",
    "_Cancel.comment": "Cancel button string for dialog box",
    "Change": "Change",
    "_Change.comment": "Change button string for dialog box",
    "Confirm": "Confirm",
    "_Confirm.comment": "Confirm button string for dialog box",
    "dueBy": "Due by",
    "_dueBy.comment": "Label to specify due date",
    "dueByDate": "Due by {0}",
    "_dueByDate.comment": "Label to specify due date. The placeholder {0} takes date and time",
    "multipleResponses": "Allow multiple responses",
    "_multipleResponses.comment": "Label for multiple responses toggle",
    "responseOptions": "Response Options",
    "_responseOptions.comment": "Section header for response options",
    "resultsVisibleTo": "Results visible to",
    "_resultsVisibleTo.comment": "Section header for results visibility options",
    "resultsVisibleToAll": "Everyone",
    "_resultsVisibleToAll.comment": "Section header for results visibility options",
    "resultsVisibleToSender": "Only Me",
    "_resultsVisibleToSender.comment": "Label for option to set Results visible to only me",
    "datePickerPlaceholder": "Select a Date...",
    "_datePickerPlaceholder.comment": "Placeholder for the date picker in due date section",
    "timePickerPlaceholder": "Select a Time...",
    "_timePickerPlaceholder.comment": "Placeholder for the time picker in due date section",
    "PollResult": "Poll Result - {0}",
    "_PollResult.comment": "Name of the poll results file to be downloaded. Placeholder expects title of the poll.",
    "UnknownMember": "Unknown member",
    "_UnknownMember.comment": "Unknown Member as text. Shown when name of the member could not be fetched",
    "AddChoice": "Add Choice",
    "_AddChoice.comment": "Text to show next to plus icon below choices in poll",
    "DeleteChoice": "Delete Choice",
    "_DeleteChoice.comment": "Delete choice button's aria label text",
    "GotIt": "Got it",
    "_GotIt.comment": "Text to be shown on button when there is error while trying to create Action",
    "ChatLieErrorText": "Send a message to get this conversation started, and then come back to Poll",
    "_ChatLieErrorText.comment": "Message to be shown when user tries to create an action(Poll/Checklist/Survey) for a new conversation.",
    "DismissMenu": "Dismiss Menu",
    "_DismissMenu.comment": "Button title for dismissing triple dot menu",
    "MoreOptions": "More Options",
    "_MoreOptions.comment": "Title for Options (triple dot) button",
    "PollOptions": "Poll Options",
    "_PollOptions.comment": "Accessibility announcement when the focus is on the poll options container",
    "GenericError": "There was a problem reaching this app. Please try after sometime.",
    "_GenericError.comment": "Error string if case of something went wrong",
    "PollDeletedError": "This poll has been deleted.",
    "_PollDeletedError.comment": "Error string if poll was deleted",
    "PollDeletedErrorDescription": "This poll is no more relevant and deleted by the creator.",
    "_PollDeletedErrorDescription.comment": "Error description string if poll was deleted by the creator",
    "Close": "Close",
    "_Close.comment": "Close button title",
    "ResponderAccessibilityLabel": "{0} responded {1} on {2}",
    "_ResponderAccessibilityLabel.comment": "accessibilty annoucement when the focus is on a responder in responder's view. Placeholder 0 expects user's name, 1 expects poll option and 2 expects date",
    "OptionResponseAccessibility": "{0}, {1} responders, {2}",
    "_OptionResponseAccessibility.comment": "accessibility annoucement when the focus is an option is poll result view. Placeholder 0 is the option, 1 is number of responders for that option, 2 is percentage of responders for that option",
    "Next": "Next",
    "_Next.comment": "Label used on creation page to go to next screen",
    "DeleteChoiceX": "Delete Choice {0}",
    "_DeleteChoiceX.comment": "Talkback label for delete button for choices. {0} is choice number",
    "ChangeDueBy": "Change Due By",
    "_ChangeDueBy.comment": "label used to change expiry date under more options button in results view",
    "DialogTalkback": "{0} dialog. {1}",
    "_DialogTalkback.comment": "talkback when any dialog opens in mobile. {0} is name of dialog, {1} is the name of button which is currently in focus. Possible values for {1} are Cancel or Confirm",
    "NotRespondedLabel": "You did not respond",
    "NotRespondedLabel.comment": "Message for non creators of poll when result visibility is set to creator only and poll is closed or expired and user has not responded",
    
    "PollDeleted": "This poll has been deleted",
    "PollClosed": "Poll Closed",
    "PollExpired": "Poll Expired",
    "ResultEveryone": "Responses are visible to everyone",
    "ResultCreator": "Responses are visible to creator only",
    "Submit": "Submit Vote",
    "Results": "View Result",
    "BeTheFirstOneToRespond": "Be the first one to take the poll",
    "_BeTheFirstOneToRespond.comment": "This string is shown if no one has responded.",
    "OneResponded": "{0} responded",
    "_OneResponded.comment": "{0} is a placeholder for user name",
    "TwoResponded": "{0} and {1} responded",
    "_TwoResponded.comment": "{0} is a placeholder for first user name. {1} is for second user name.",
    "ThreeResponded": "{0}, {1} and {2} responded",
    "_ThreeResponded.comment": "{0} is a placeholder for first user name. {1} is for second user name. {2} is for second user name.",
    "ThreeAndOneOtherResponded": "{0}, {1}, {2} and 1 other responded",
    "_ThreeAndOneOtherResponded.comment": "{0} is a placeholder for first user name. {1} is for second user name. {2} is for second user name.",
    "ThreeAndOthersResponded": "{0}, {1}, {2} and {3} others responded",
    "_ThreeAndOthersResponded.comment": "{0} is a placeholder for first user name. {1} is for second user name. {2} is for second user name. {3} is for others count.",
    "CreateNewPoll": "Create a new poll",
    "_CreateNewPoll.comment": "String to be shown as title for window in which new poll can be created",
    "ResultsTitle": "Result view",
    "_ResultsTitle.comment": "String to be shown as title for window in which poll results are shown. View is noun.",
  
    "$manifest.name": "Poll",
    "_$manifest.name.comment": "{MaxLength=30}",
    "$manifest.views.LaunchView.header": "Create Poll",
    "_$manifest.views.LaunchView.header.comment": "{MaxLength=32}",
    "$manifest.description": "Ask a question and get people's opinion",
    "_$manifest.description.comment": "{MaxLength=80}",
    
    "$manifest.msTeamsProps.name.short": "Poll",
    "_$manifest.msTeamsProps.name.short.comment": "{MaxLength=30}",
    "$manifest.msTeamsProps.name.full": "Poll",
    "_$manifest.msTeamsProps.name.full.comment": "{MaxLength=100}",
    "$manifest.msTeamsProps.description.short": "Ask a question and get people's opinion",
    "_$manifest.msTeamsProps.description.short.comment": "{MaxLength=80}",
    "$manifest.msTeamsProps.description.full": "Get your team's opinion by creating a poll in a chat or channel.​ Find the app in '…' under the message compose box​. Enter your question and choices and you're good to go. Stay on top of participation by tracking responses. Download poll result to share with your co-workers.",
    "_$manifest.msTeamsProps.description.full.comment": "{MaxLength=4000}"  
};

export let pollOm = {
    title: 'My first Poll',
    status: "ACTIVE",
    options : [ 
        {
            optionsId: "0",
            displayName: 'Choice One',
        }, 
        {
            optionsId: "1",
            displayName: 'I am the second choice'   
        },
        {
            optionsId: "2",
            displayName: 'I am the third choice'    
        }
    ],
    responders: [
        {
            userId: "$UserId",
            displayName: "Test_FirstName Test_LastName",
            optionsId: "-1"
        }
    ],
    "strings" : pollStrings
}

export let pollDdsDefinition = 
{
	"type": "SharedMap",
	"keys": {
		"title": { type: "string", default: "Enter poll question" },
        status: { type: "string", default: "Active" },
		"options": {
			type: "SharedObjectSequence",
			itemType: {
				"type": "SharedMap",
				"keys" : {
					"optionsId" : { type: "string" },
                    "displayName": { type: "string", default: "<<choice>>" },
				}
			},
        },
        "responders":  {
            type: "SharedObjectSequence",
			itemType: {
            "type": "SharedMap",
            "keys" : {
                "userId" : { type: "string" },
                "displayName": { type: "string" },
                "optionsId": { type: "string" }
            }   
        }
        } 		
	}
};

export let pollInitData = {
    title: "Please choose your ice-cream flavour.",
    options: [ 
        {
            optionsId: "1",
            displayName: "Vanilla"
        },
        {
            optionsId: "2",
            displayName: "Chocolate"
        },
        {
            optionsId: "3",
            displayName: "Butterscotch"
        },
    ],
    responders: []
};
