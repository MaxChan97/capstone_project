/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.messagingEntities.Message;
import java.io.StringReader;
import java.util.Date;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.MessageSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("message")
public class MessageResource {

  @EJB
  private MessageSessionBeanLocal messageSBLocal;

  @POST
  @Path("/{chatId}/{senderId}/{recipientId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response addMessageToChat(@PathParam("chatId") Long chatId, @PathParam("senderId") Long senderId, @PathParam("recipientId") Long recipientId, String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    JsonObject jsonObject = reader.readObject();
    String messageBody = jsonObject.getString("body");

    Message m = new Message();
    m.setBody(messageBody);
    m.setDateTime(new Date());

    try {
      messageSBLocal.addMessageToChat(chatId, senderId, recipientId, m);
      return Response.status(204).build();
    } catch (Exception e) {
      JsonObject exception = Json.createObjectBuilder()
              .add("error", e.getMessage())
              .build();

      return Response.status(404).entity(exception)
              .type(MediaType.APPLICATION_JSON).build();
    }
  }

  @POST
  @Path("/file/{chatId}/{senderId}/{recipientId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response addFileToChat(@PathParam("chatId") Long chatId, @PathParam("senderId") Long senderId, @PathParam("recipientId") Long recipientId, String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    JsonObject jsonObject = reader.readObject();
    String messageBody = jsonObject.getString("body");
    String fileName = jsonObject.getString("fileName");
    String fileUrl = jsonObject.getString("fileUrl");
    String fileType = jsonObject.getString("fileType");

    System.out.println("reach");

    Message m = new Message();
    m.setFileName(fileName);
    m.setFileUrl(fileUrl);
    m.setFileType(fileType);
    m.setBody(messageBody);
    m.setDateTime(new Date());

    try {
      messageSBLocal.addMessageToChat(chatId, senderId, recipientId, m);
      return Response.status(204).build();
    } catch (Exception e) {
      JsonObject exception = Json.createObjectBuilder()
              .add("error", e.getMessage())
              .build();

      return Response.status(404).entity(exception)
              .type(MediaType.APPLICATION_JSON).build();
    }
  }
}
