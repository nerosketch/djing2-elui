export interface ICustomerContract {
  id?: number
  customer_id?: number
  title: string
  start_service_time: string
  end_service_time: string | null
  is_active: boolean
  contract_number: string
  note: string
}

export interface ICustomerContractAttachment {
  id: number
  contract: number
  author: number | null
  title: string
  doc_file: string
  create_time: string
}
