const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const createFacture = (commande,req,filepath)=> {
    try {
        function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
            doc.fontSize(12)
                .text(c1, 50, y)
                .text(c2, 150, y)
                .text(c3 +'€', 280, y, { width: 90, align: 'right' })
                .text(c4, 370, y, { width: 90, align: 'right' })
                .text(c5 +'€', 0, y, { align: 'right' });
        }

        function generateDetail(doc, y, c1, c2, c3, c4, c5) {
            doc.fontSize(10)
                .text(c1, 70, y)
                .text(c2, 170, y)
                .text(c3 , 300, y, { width: 90, align: 'right' })
                .text(c4 +'€', 390, y, { width: 90, align: 'right' })
                // .text(c5, 0, y, { align: 'right' });
        }

        function generateHr(doc, y) {
            doc
              .strokeColor("#aaaaaa")
              .lineWidth(1)
              .moveTo(50, y)
              .lineTo(550, y)
              .stroke();
          }

        const doc = new PDFDocument();
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Crée le répertoire si nécessaire
        }
        // Chemin où le PDF sera sauvegardé
        doc.pipe(fs.createWriteStream(filepath));
    
        // Titre de la facture
        doc.fontSize(20).text('Facture');
    
        // Informations de l'entreprise
        doc.fontSize(12).text(`Entreprise: Nervii Studio`, 50, 100,{ align: 'right' });
        doc.text(`Adresse: 2 rue du moulin`, 50, 115,{ align: 'right' });
        doc.text(`59222 croix caluyau`, 50, 130,{ align: 'right' });
        doc.text(`Téléphone: 0675974553`, 50, 145,{ align: 'right' });
        doc.text(`siret: 85084153700010`, 50, 145,{ align: 'right' });
    
        // Espacer les sections
        doc.moveDown(2);
        const address = req.body.address_billing
        // Informations du client
        doc.text(`Facturé à: ${req.body.user.firstname} ${req.body.user.lastname}`, 50, 180);
        doc.text(`Adresse: ${address.number} ${address.street}`, 50, 195);
        doc.text(`${address.cityCode} ${address.city} ${address.country}`, 50, 210);
        doc.text(`Date : ${Date.now()}`, 50, 210);
    
        // doc.text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
		// .text(`Invoice Date: ${new Date()}`, 50, 215)
		// .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)

		// .text(shipping.name, 300, 200)
		// .text(shipping.address, 300, 215)
		// .text(
		// 	`${shipping.city}, ${shipping.state}, ${shipping.country}`,
		// 	300,
		// 	130,
		// )
		// .moveDown();

        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        generateTableRow(
          doc,
          invoiceTableTop,
          "Produit",
          "Description",
          "Coût Unitaire",
          "Quantité",
          "Coût Total"
        );
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");
        
        // Espacer les sections
        doc.moveDown(2);
    
        // Informations sur les produits/services
        let counterLine = 0
        let counterDetail = 0
        commande.orderproducts.forEach(item => {
            counterLine += 1
            const positionRow = invoiceTableTop + (counterLine *30) + (counterDetail * 20)
            
            generateTableRow(doc,positionRow,item.product.name,item.product.description,item.product.price,item.quantity,item.price);
            if(item.orderproductoptions?.length > 0){
                item.orderproductoptions.forEach(optionItem =>{
                    counterDetail += 1
                    const positionDetail = invoiceTableTop + (counterLine *30) + (counterDetail * 20)
                    generateDetail(doc,positionDetail,'option',optionItem.productoption.name,optionItem.subOption.detail,optionItem.price)
                    // doc.fontSize(10).text(`- option : ${optionItem.productoption.name} choix : ${optionItem.subOption.detail} prix option : ${optionItem.price}€`, 150, doc.y);
                })
            }
            if(item.orderproductpersonalizations?.length > 0){
                item.orderproductpersonalizations.forEach(persoItem =>{
                    counterDetail += 1
                    const positionDetail = invoiceTableTop + (counterLine *30) + (counterDetail * 20)
                    generateDetail(doc,positionDetail,'personalisation',persoItem.personalization.name,persoItem.consumer_text,persoItem.personalization.price)
                    // doc.fontSize(10).text(`- option : ${optionItem.productoption.name} choix : ${optionItem.subOption.detail} prix option : ${optionItem.price}€`, 150, doc.y);
                })
            }
            const position = invoiceTableTop + (counterLine *30) + (counterDetail * 20);
            generateHr(doc, position + 20);
        });
    
        // Total
        doc.moveDown(2);
        doc.fontSize(15).text(`Montant Total: ${commande.price}€`, {
            align: 'right'
        });
    
        // Terminer le PDF
        doc.end();
        return 'facture created'
    } catch (error) {
        return error
    }
}

// Données d'exemple pour la facture
const invoice = {
    companyName: 'Authenticae',
    companyAddress: '2 rue du moulin 59222 Croix caluyau',
    companyPhone: '0675974553',
    customerName: 'Jean Dupont',
    customerAddress: '456 Rue du Client, 75002 Paris',
    items: [
        { name: 'Produit 1', price: 50 },
        { name: 'Produit 2', price: 30 },
        { name: 'Service 1', price: 100 },
    ]
};

module.exports = {createFacture}