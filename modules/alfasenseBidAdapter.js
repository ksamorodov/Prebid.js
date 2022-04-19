// ALFASENSE BID ADAPTER for Prebid 1.13
import { logInfo, getBidIdParameter } from '../src/utils.js';
import { getStorageManager } from '../src/storageManager.js';
import { registerBidder } from '../src/adapters/bidderFactory.js';

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
  },

  buildRequests: function (validBidRequests, bidderRequest) {
    logInfo('validBidRequests', validBidRequests);

    let currency = 'RUB';

    const payload = {
      'places': [],
      'settings': {
        'currency': currency,
      }
    };
    validBidRequests.forEach((iterator) => {
      let id = getBidIdParameter('siteid', iterator.params) + '';
      let placementId = getBidIdParameter('placementId', iterator.params) + '';
      let sizes = getBidIdParameter('sizes', validBidRequests[0]);

      payload.places.push({
        'id': id,
        'placementId': placementId,
        'sizes': sizes
      });
    });

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
    const bidResponses = [];
    const bidResponse = {
      requestId: bidRequest.data.places[0].id,
      cpm: serverResponse.body.bids[0].cpm,
      currency: serverResponse.body.bids[0].currency,
      width: serverResponse.body.bids[0].size.width,
      height: serverResponse.body.bids[0].size.height,
      creativeId: '123abc', // ?
      dealId: '123abc', // ?
      netRevenue: true, // ?
      ttl: 350, // ?
      ad: serverResponse.body.bids[0].displayurl, // ?
      mediaType: 'native', // ?
      meta: {
        advertiserDomains: [], // ?
      }
    };
    bidResponses.push(bidResponse);
    return bidResponses;
  },
};
registerBidder(spec);
