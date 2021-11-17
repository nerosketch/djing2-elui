export interface ICustomerContract {
  id?: number
  customer?: number
  start_service_time: string
  end_service_time: string | null
  is_active: boolean
  contract_number: string
  note: string
}
