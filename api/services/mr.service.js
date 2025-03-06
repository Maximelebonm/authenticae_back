const mrConfig = require("../configs/mr.config");
const axios = require('axios');

const generateShipmentCreationRequestXML = () => {
    return `<?xml version="1.0" encoding="utf-8"?>
    <ShipmentCreationRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.example.org/Request">
        <Context>
            <Login>${mrConfig.login}</Login>
            <Password>${mrConfig.pw}</Password>
            <CustomerId>${mrConfig.brand}</CustomerId>
            <Culture>fr-FR</Culture>
            <VersionAPI>1.0</VersionAPI>
        </Context>
        <OutputOptions>
            <OutputFormat>10x15</OutputFormat>
            <OutputType>PdfUrl</OutputType>
        </OutputOptions>
        <ShipmentsList>
            <Shipment>
                <OrderNo>KDZ-9999</OrderNo>
                <CustomerNo>CUS1234</CustomerNo>
                <ParcelCount>1</ParcelCount>
                <DeliveryMode Mode="24R" Location="FR-66974" />
                <CollectionMode Mode="CCC" Location="" />
                <Parcels>
                    <Parcel>
                        <Content>Livres</Content>
                        <Weight Value="1000" Unit="gr" />
                    </Parcel>
                </Parcels>
                <DeliveryInstruction>Livrer au fond a droite</DeliveryInstruction>
                <Sender>
                    <Address>
                        <Title />
                        <Firstname />
                        <Lastname />
                        <Streetname>Avenue Antoine Pinay</Streetname>
                        <HouseNo>4</HouseNo>
                        <CountryCode>FR</CountryCode>
                        <PostCode>59510</PostCode>
                        <City>HEM</City>
                        <AddressAdd1>Mondial Relay</AddressAdd1>
                        <AddressAdd2 />
                        <AddressAdd3>Mondial Relay</AddressAdd3>
                        <PhoneNo />
                        <MobileNo>+33320202020</MobileNo>
                        <Email>contact@mondialrelay.fr</Email>
                    </Address>
                </Sender>
                <Recipient>
                    <Address>
                        <Title>Mr</Title>
                        <Firstname>John</Firstname>
                        <Lastname>THETESTER</Lastname>
                        <Streetname>test street</Streetname>
                        <HouseNo>10</HouseNo>
                        <CountryCode>FR</CountryCode>
                        <PostCode>75001</PostCode>
                        <City>Paris 1</City>
                        <AddressAdd1 />
                        <AddressAdd2 />
                        <AddressAdd3 />
                        <PhoneNo>+33320202020</PhoneNo>
                        <MobileNo />
                        <Email>contact@mondialrelay.fr</Email>
                    </Address>
                </Recipient>
            </Shipment>
        </ShipmentsList>
    </ShipmentCreationRequest>`;
};

const MrConnection = async () => {
    const url = mrConfig.url; ;
    const headers = {
        "Content-Type": "application/xml",
        "Accept": "application/xml"
    };

    try {
        const xmlData = generateShipmentCreationRequestXML();
        const response = await axios.post(url,
            xmlData,
            {headers}
        );
        
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error sending XML request:", error);
        throw error;
    }
}

module.exports = {MrConnection};