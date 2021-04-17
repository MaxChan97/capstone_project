/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.BankAccount;
import enumeration.BankEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
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

    @POST
    @Path("/{personId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response createBankAccount(@PathParam("personId") Long id, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String accountNumber = jsonObject.getString("accountNumber");
        String displayName = jsonObject.getString("displayName");
        String bankEnumStr = jsonObject.getString("bankEnum");

        try {
            BankEnum bankEnum = convertToBankEnum(bankEnumStr);
            BankAccount ba = new BankAccount();
            ba.setAccountNumber(accountNumber);
            ba.setBankEnum(bankEnum);
            ba.setDisplayName(displayName);

            BankAccount addedBankAccount = baSB.createBankAccount(ba, id);
            return Response.status(200).entity(addedBankAccount).type(MediaType.APPLICATION_JSON).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }

    @PUT
    @Path("/{bankAccountId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response editBankAccount(@PathParam("bankAccountId") Long id, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String accountNumber = jsonObject.getString("accountNumber");
        String displayName = jsonObject.getString("displayName");
        String bankEnumStr = jsonObject.getString("bankEnum");

        try {
            BankEnum bankEnum = convertToBankEnum(bankEnumStr);
            BankAccount ba = new BankAccount();
            ba.setId(id);
            ba.setAccountNumber(accountNumber);
            ba.setBankEnum(bankEnum);
            ba.setDisplayName(displayName);

            baSB.updateBankAccount(ba);
            return Response.status(204).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }

    @DELETE
    @Path("/{personId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteBankAccount(@PathParam("personId") Long id) {
        try {
            baSB.deleteBankAccount(id);
            return Response.status(204).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }

}
