export interface ReportData {
    stock_report: StockReport[];
    vendor_report: VendorReport[];
    invoice_date_report: InvoiceDateReport[];
    invoice_client_report: InvoiceClientReport[];
    invoice_product_report: InvoiceProductReport[];
  }
  
  export interface StockReport {
    product_id: number;
    product_name: string;
    stock_on_hand: number;
    rate: number;
    recieved_date: string;
    supplier: string;
  }
  
  export interface VendorReport {
    vendor_id: number;
    vendor_name: string;
    contact_person: string;
    phone: string;
    product_name: string;
    supplied_quantity: number;
    rate: number;
    recieved_date: string;
  }
  
  export interface InvoiceDateReport {
    invoice_date: string;
    invoice_count: number;
    total_amount: number;
    payment_status: string;
    invoice_ids: string;
  }
  
  export interface InvoiceClientReport {
    client_id: number;
    client_name: string;
    invoice_count: number;
    total_amount: number;
    payment_status: string;
    invoice_ids: string;
  }
  
  export interface InvoiceProductReport {
    product_id: number;
    product_name: string;
    total_quantity_sold: number;
    total_amount: number;
    invoice_count: number;
  }