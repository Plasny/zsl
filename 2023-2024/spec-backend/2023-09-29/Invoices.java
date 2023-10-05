import java.util.ArrayList;

public class Run {
    public static void main(String[] args) {
        Invoices is = new Invoices();

        is.addInvoice(new Invoice("A001", "sth", 2, 1.5));
        is.addInvoice(new Invoice("A002", "sth", 1, 2.5));
        System.out.println(is.toString());
    }
}

public class Invoices {
    private ArrayList<Invoice> invoiceList = new ArrayList<Invoice>();

    public void addInvoice(Invoice invoice) {
        invoiceList.add(invoice);
    }

    public int allQuantities() {
        int sum = 0;

        for(int i = 0; i < invoiceList.size(); i++) {
            sum += invoiceList.get(i).getQuantity();
        }

        return sum;
    }

    public double avgUnitPrice() {
        double sum = 0;
        int i = 0;

        for(; i < invoiceList.size(); i++) {
            sum += invoiceList.get(i).getUnitPrice();
        }

        return sum / i;
    }

    public String toString() {
        return "{allQuantities=" + allQuantities() + ", averageUnitPrice=" + avgUnitPrice() + "}";
    }
}

public class Invoice {
    private String id;
    private String description;
    private int quantity;
    private double unitPrice;

    public Invoice(String id, String description, int quantity, double unitPrice) {
        this.id = id;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public void setQuantity(int quentity) {
        this.quantity = quentity;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public double getUnitPrice() {
        return this.unitPrice;
    }
}
