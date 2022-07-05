import express, {Request, Response, Router} from "express";
import {ContractService} from "../services";
import {checkUserConnected} from "../middlewares";

export class ContractController {

    async getAll(req: Request, res: Response) {
        try {
            const contracts = await ContractService.getInstance().getAll();
            res.send({
                response: contracts
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getById(req: Request, res: Response) {
        let contract;
        try {
            if (req.query.id) {
                contract = await ContractService.getInstance().getById(parseInt(<string>req.params.id));
            }
            if (contract) {
                res.send({
                    response: contract
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getContractByParentId(req: Request, res: Response) {
        try {
            const contracts = await ContractService.getInstance().getByParent(parseInt(<string>req.params.idParent));
            res.send({
                response: contracts
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async getContractByBabysitterId(req: Request, res: Response) {
        try {
            const contracts = await ContractService.getInstance().getByBabysitter(parseInt(<string>req.params.idBabysitter));
            res.send({
                response: contracts
            });
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async createContract(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().add({
                idParent: req.body.idParent,
                idBabysitter: req.body.idBabysitter,
                validateAt: req.body.validateAt,
                numberOfHours: req.body.numberOfHours,
                hourlyWage: req.body.hourlyWage,
                numberOfSitting: req.body.numberOfSitting,
                numberOfHoursDone: req.body.numberOfHoursDone,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            });
            if (contract) {
                res.send({
                    response: contract
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async updateContract(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().update({
                id: parseInt(<string>req.params.id),
                idParent: req.body.idParent,
                idBabysitter: req.body.idBabysitter,
                validateAt: req.body.validateAt,
                numberOfHours: req.body.numberOfHours,
                hourlyWage: req.body.hourlyWage,
                numberOfSitting: req.body.numberOfSitting,
                numberOfHoursDone: req.body.numberOfHoursDone,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            });
            if (contract) {
                res.send({
                    response: contract
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    async deleteContract(req: Request, res: Response) {
        try {
            const contract = await ContractService.getInstance().delete(parseInt(<string>req.params.id));
            if (contract) {
                res.send({
                    response: contract
                });
            }else {
                res.status(404).end();
            }
        } catch (err) {
            console.log(err)
            res.status(401).end(); // unauthorized
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/all', checkUserConnected(), this.getAll.bind(this));
        router.get('/:id', checkUserConnected(), this.getById.bind(this));
        router.get('/getByParent/:idParent', checkUserConnected(), this.getContractByParentId.bind(this));
        router.get('/getByBabysitter/:idBabysitter', checkUserConnected(), this.getContractByBabysitterId.bind(this));
        router.post('/create', express.json(), checkUserConnected(), this.createContract.bind(this));
        router.put('/update', express.json(), checkUserConnected(), this.updateContract.bind(this));
        router.delete('/delete', checkUserConnected(), this.deleteContract.bind(this));
        return router;
    }
}