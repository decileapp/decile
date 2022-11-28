import { CourierClient } from "@trycourier/courier";

const courier = CourierClient({
  authorizationToken: process.env.COURIER_TOKEN,
});

// const Mailjet = require("node-mailjet").connect(
//   process.env.EMAILUSER,
//   process.env.EMAILPASS
// );

/**
 * Mailjet helper that sends emails
 * @param {Object} from From email and name
 * @param {Object} to To email and name
 * @param {Array} templateId ID of template saved on mailjet
 * @param {Object} vars Object
 * @return {Promise} Object with the result of sending email
 */

const emailHelper = async ({
  from,
  to,
  templateId,
  vars,
}: {
  from: string;
  to: string;
  templateId: string;
  vars: {};
}) => {
  try {
    const { requestId } = await courier.send({
      message: {
        to: {
          email: to,
        },
        template: templateId,
        data: vars,
      },
    });
    return requestId;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default emailHelper;
