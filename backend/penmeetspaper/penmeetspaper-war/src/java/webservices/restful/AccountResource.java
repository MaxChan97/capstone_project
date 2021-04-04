/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Administrator;
import entity.Person;
import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.AccountSessionBeanLocal;

/**
 * REST Web Service
 *
 * @author carlc
 */
@Path("account")
public class AccountResource {

    @EJB
    private AccountSessionBeanLocal accountSessionLocal;

    @GET
    @Path("login/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@QueryParam("email") String email, @QueryParam("password") String password) {
        try {
            Person p = accountSessionLocal.login(email, password);
            if (p == null) {
                throw new NotValidException(AccountSessionBeanLocal.PERSON_BANNED_FROM_LOGIN);
            }
            return Response.status(200).entity(
                    p
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(400).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end login

    @GET
    @Path("adminlogin/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response adminLogin(@QueryParam("email") String email, @QueryParam("password") String password) {
        try {
            Administrator admin = accountSessionLocal.adminLogin(email, password);
            return Response.status(200).entity(
                    admin
            ).type(MediaType.APPLICATION_JSON).build();
        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(400).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    } //end login

}
