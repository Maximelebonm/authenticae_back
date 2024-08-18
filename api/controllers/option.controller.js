const optionService = require('../services/option.service')

const deleteSubOption = async (req,res) => {
    try {
        const optionBack = await optionService.findOptionsAndSubOption(req.params.id)
        console.log(optionBack[0].subOptions)
        const subOptionExist = optionBack[0].subOptions.find((subOption)=> subOption.Id_subOption === req.body.Id_subOption)
        if(subOptionExist){
            const deleteSuboption = await optionService.deleteSubOption(req.body.Id_subOption)
            res.status(200).send({message : 'subOption deleted'})
        }
        else{
            res.status(200).send({message : "subOption doesn't exist"})
        }
    } catch (error) {
        res.status(500).send({message : 'subOption not deleted error'})
    }
}

const deleteOption = async (req,res) => {
    try {
        const OptionExist = await optionService.findOption(req.params.id)
        if(OptionExist){
            const deleteOption = await optionService.deleteOption(req.body.Id_option)
            res.status(200).send({message : 'subOption deleted'})
        }
        else{
            res.status(200).send({message : "subOption doesn't exist"})
        }
    } catch (error) {
        res.status(500).send({message : 'subOption not deleted error'})
    }
}

module.exports = {deleteSubOption,deleteOption}