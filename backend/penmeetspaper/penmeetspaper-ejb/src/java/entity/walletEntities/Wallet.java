/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity.walletEntities;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 *
 * @author Shawn
 */
@Entity
public class Wallet implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double credits;

    // Unidirectional
    @OneToMany
    private List<PaymentCard> paymentCards = new ArrayList<>();

    //Unidirectional
    @OneToMany
    private List<WalletTransaction> transactions = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getCredits() {
        return credits;
    }

    public void setCredits(double credits) {
        this.credits = credits;
    }

    public List<PaymentCard> getPaymentCards() {
        return paymentCards;
    }

    public void setPaymentCards(List<PaymentCard> paymentCards) {
        this.paymentCards = paymentCards;
    }

    public void addPaymentCard(PaymentCard card) {
        this.paymentCards.add(card);
    }

    public List<WalletTransaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<WalletTransaction> transactions) {
        this.transactions = transactions;
    }

    public void addWalletTransaction(WalletTransaction trans) {
        this.transactions.add(trans);
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Wallet)) {
            return false;
        }
        Wallet other = (Wallet) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.walletEntities.Wallet[ id=" + id + " ]";
    }

}
