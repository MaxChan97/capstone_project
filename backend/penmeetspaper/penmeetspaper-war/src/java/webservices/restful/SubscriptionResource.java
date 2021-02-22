/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import javax.ejb.EJB;
import javax.ws.rs.Path;
import session.SubscriptionSessionBeanLocal;

/**
 *
 * @author shawn
 */
@Path("subscription")
public class SubscriptionResource {

    @EJB
    private SubscriptionSessionBeanLocal subscriptionSB;

}
