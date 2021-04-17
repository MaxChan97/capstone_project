/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import enumeration.BankEnum;
import exception.NotValidException;
import java.io.StringReader;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.BankAccountSessionBeanLocal;

/**
 *
 * @author SHAWN LIM
 */
@Path("bankAccount")
public class BankAccountResource {

    @EJB
    private BankAccountSessionBeanLocal baSB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

        return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

    private BankEnum convertToBankEnum(String str) throws NotValidException {
        switch (str) {
            case "DBS":
                return BankEnum.DBS;
            case "OCBC":
                return BankEnum.OCBC;
            case "SC":
                return BankEnum.SC;
            case "POSB":
                return BankEnum.POSB;
            default:
                throw new NotValidException(BankAccountSessionBeanLocal.BANK_ENUM_NOT_RECOGNISED);
        }
    }
    /*
    @POST
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSubscriptions(@PathParam("id") Long id) {
     */

}
