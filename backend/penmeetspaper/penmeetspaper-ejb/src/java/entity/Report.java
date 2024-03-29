/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import enumeration.ReportStateEnum;
import enumeration.ReportTypeEnum;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Shawn
 */
@Entity
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048)
    private String messageBody;

    @Column
    private String category;

    @Enumerated(EnumType.STRING)
    private ReportStateEnum reportState;

    @Enumerated(EnumType.STRING)
    private ReportTypeEnum reportType;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateSubmitted;

    @Column(nullable = false)
    private String reportContentId;

    @ManyToOne
    @JoinColumn(name = "person_report")
    private Person reporter;

    private Long reportedPersonId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    public ReportStateEnum getReportState() {
        return reportState;
    }

    public void setReportState(ReportStateEnum reportState) {
        this.reportState = reportState;
    }

    public ReportTypeEnum getReportType() {
        return reportType;
    }

    public void setReportType(ReportTypeEnum reportType) {
        this.reportType = reportType;
    }

    public Date getDateSubmitted() {
        return dateSubmitted;
    }

    public void setDateSubmitted(Date dateSubmitted) {
        this.dateSubmitted = dateSubmitted;
    }

    public String getReportContentId() {
        return reportContentId;
    }

    public void setReportContentId(String reportContentId) {
        this.reportContentId = reportContentId;
    }

    public Person getReporter() {
        return reporter;
    }

    public void setReporter(Person reporter) {
        this.reporter = reporter;
    }

    /**
     * @return the category
     */
    public String getCategory() {
        return category;
    }

    /**
     * @param category the category to set
     */
    public void setCategory(String category) {
        this.category = category;
    }

    /**
     * @return the reportedPersonId
     */
    public Long getReportedPersonId() {
        return reportedPersonId;
    }

    /**
     * @param reportedPersonId the reportedPersonId to set
     */
    public void setReportedPersonId(Long reportedPersonId) {
        this.reportedPersonId = reportedPersonId;
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
        if (!(object instanceof Report)) {
            return false;
        }
        Report other = (Report) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.adminEntities.Report[ id=" + id + " ]";
    }

}
