export interface ContractProps {
    id?: number,
    idParent: number,
    idBabysitter: number,
    validateAt: string,
    numberOfHours: number,
    hourlyWage: number,
    qrCode?: number,
    numberOfSitting: number,
    numberOfHoursDone: number,
    startDate: number,
    endDate: number
}