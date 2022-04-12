// ALFASENSE BID ADAPTER for Prebid 1.13
// eslint-disable-next-line standard/object-curly-even-spacing
import { logInfo, getBidIdParameter} from '../src/utils.js';
import { getStorageManager } from '../src/storageManager.js';

const BIDDER_CODE = 'alfasense';
const ALFASENSE_BID_URL = 'https://pbs.alfasense.com'; // todo update url
const REQUEST_METHOD = 'POST';

export const storage = getStorageManager({bidderCode: BIDDER_CODE});
export const spec = {
  code: BIDDER_CODE,

  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {object} bid The bid to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function (bid) {
    return !!bid.params.placementId;
    // && !!bid.params.id && !!bid.params.sizes;
  },

  buildRequests: function (validBidRequests, bidderRequest) {
    logInfo('validBidRequests', validBidRequests);

    // let win = getWindowLocation();
    // let customID = Math.round(Math.random() * 999999999) + '-' + Math.round(new Date() / 1000) + '-1-46-';
    let id = getBidIdParameter('id', validBidRequests[0].params) + '';
    let placementId = getBidIdParameter('placementId', validBidRequests[0].params) + '';
    let currency = getBidIdParameter('currency', validBidRequests[0].params);
    let sizes = getBidIdParameter('sizes', validBidRequests[0].params);
    currency = 'RUB';

    const payload = {
      'places': [
        {
          'id': id,
          'placementId': placementId,
          'sizes': sizes,
        }
      ],
      'settings': {
        'currency': currency,
      }
    };

    return {
      method: REQUEST_METHOD,
      url: ALFASENSE_BID_URL,
      data: payload,
      options: {
        contentType: 'application/json',
        withCredentials: false,
      }
    }
  },

  interpretResponse: function (serverResponse, bidRequest) {
    const response = serverResponse.body;
    const bidResponses = [];
    if (!response.error) {
      bidResponses.push(response);
    }
    return bidResponses;
  },
};
