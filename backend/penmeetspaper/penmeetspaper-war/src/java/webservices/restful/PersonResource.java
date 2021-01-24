/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Person;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import session.PersonSessionBeanLocal;

/**
 * REST Web Service
 *
 * @author carlc
 */
@Path("person")
public class PersonResource {

  @EJB
  private PersonSessionBeanLocal personSessionLocal;

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public List<Person> getAllPerson() {
    return personSessionLocal.searchPerson(null);
  } //end getAllPerson

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Person createPerson(Person p) {
    System.out.println("Create person");
    System.out.println(p);
    personSessionLocal.createPerson(p);
    return p;
  } //end createPerson
}
