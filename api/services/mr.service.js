const mrConfig = require("../configs/mr.config");
const axios = require('axios');
const { createShipment, searchZipCodes,searchPointsRelais,getLabels,generateXML, getTracking  } = require('@frontboi/mondial-relay/node');


const getLabelForShipment = async (req, res) => {
  try {
const xml = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <WSI2_RecherchePointRelais xmlns="http://www.mondialrelay.fr/webservice/">
      <Enseigne>LE LONGCHAMP</Enseigne>
      <Pays>FR</Pays>
      <Ville>BOUSIES</Ville>
      <CP>59222</CP>
      <Taille></Taille>
      <Poids></Poids>
      <Action></Action>
      <Security>ABCDEFGH</Security>
    </WSI2_RecherchePointRelais>
  </soap:Body>
</soap:Envelope>`;
    // const xml = generateXML(data)

    const response = await axios.get("https://connect-api-sandbox.mondialrelay.com/api/shipment", {
      params: {
        country: "FR",          // Obligatoire
        postalCode: "75011",    // Obligatoire
        city: "PARIS",          // Optionnel mais recommandé
        limit: 10               // Nombre de résultats
      },
      headers: {
        "X-Api-Key": "",
        "Accept": "application/json"
      }
    });
    // const responseData = resp.data;
    // res.set('Content-Type', 'text/xml');  

   console.log(response);


  //  console.log(xml)
//     const response = await searchPointsRelais({
//           Enseigne : 'BDTEST',
//           Pays: 'FR',
//           Ville: "POIX DU NORD",
//           CP: '59218',
// //          Security?: string,
//           PrivateKey: "ABCDEFGH"
//     });
//     console.log(response);
   
  } catch (error) {
    console.log(error);
   
  }
};



const generateLabel = async (req,userToSend) => {
  try {
    const response = await createShipment({
      context: {
      CustomerId: mrConfig.brand, 
      Login: mrConfig.login, 
      Password: mrConfig.pw,
      },
      shipment: {
        OrderNo: req.body.numberFacture,
        CustomerNo: req.body.customer_no,
        ParcelCount: '1',
        DeliveryInstruction: '',
        CollectionMode: {
          Mode: 'CCC',
        },

        DeliveryMode: {
          Mode: '24R',
          Location: req.body.location,
        },

        Sender: {
          Firstname: req.user.firstname,
          Lastname: req.user.lastname,
          Streetname: req.user.addresses[0].street,
          HouseNo: req.user.addresses[0].number.toString(),
          CountryCode: 'FR',
          PostCode: req.user.addresses[0].cityCode.toString(),
          City: req.user.addresses[0].city,
          PhoneNo: req.user.phone.toString(),
          MobileNo: req.user.phone.toString(),
          Email: req.user.email,
        },

        Recipient: {
          Title: 'Mr',
          Firstname: req.body.user.firstname,
          Lastname: req.body.user.lastname,
          Streetname: userToSend.addresses[0].street,
          HouseNo: userToSend.addresses[0].number.toString(),
          CountryCode: 'FR',
          PostCode: userToSend.addresses[0].cityCode.toString(),
          City: userToSend.addresses[0].city,
          PhoneNo: userToSend.phone.toString(),
          MobileNo: req.body.user.phone.toString(),
          Email: req.body.user.email,
        },

        Parcels: {
          Parcel: {
            Content: '',
            Weight: {
              Unit: 'gr',
              Value: 2000,
            },
          },
        },
      },
    })
    
    console.log(response)
    return response;
  } catch (e) {
    console.error("Erreur lors de la création de l'étiquette :", e.message);
  }
}


module.exports = {generateLabel,getLabelForShipment}