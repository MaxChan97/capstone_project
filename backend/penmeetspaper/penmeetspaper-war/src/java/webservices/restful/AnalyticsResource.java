/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.EarningsAnalytics;
import entity.FollowersAnalytics;
import entity.SubscribersAnalytics;
import entity.ViewersAnalytics;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.AnalyticsSessionBeanLocal;

/**
 *
 * @author carlc
 */
@Path("analytics")
public class AnalyticsResource {

  @EJB
  private AnalyticsSessionBeanLocal analyticsSessionBean;

  private JsonObject createJsonObject(String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    return reader.readObject();
  }

  private Response buildError(Exception e, int statusCode) {
    JsonObject exception = Json.createObjectBuilder()
            .add("error", e.getMessage())
            .build();

    return Response.status(statusCode).entity(exception)
            .type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/subscribersAnalytics/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSubscribersAnalytics(@PathParam("id") Long id) {
    try {
      SubscribersAnalytics subscribersAnalytics = analyticsSessionBean.getSubscribersAnalytics(id);
      return Response.status(200).entity(subscribersAnalytics).type(MediaType.APPLICATION_JSON).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  }
  
  @GET
  @Path("/followersAnalytics/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getFollowersAnalytics(@PathParam("id") Long id) {
    try {
      FollowersAnalytics followersAnalytics = analyticsSessionBean.getFollowersAnalytics(id);
      return Response.status(200).entity(followersAnalytics).type(MediaType.APPLICATION_JSON).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  }
  
  @GET
  @Path("/earningsAnalytics/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getEarningsAnalytics(@PathParam("id") Long id) {
    try {
      EarningsAnalytics earningsAnalytics = analyticsSessionBean.getEarningsAnalytics(id);
      return Response.status(200).entity(earningsAnalytics).type(MediaType.APPLICATION_JSON).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  }
  
  @GET
  @Path("/viewersAnalytics/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getViewersAnalytics(@PathParam("id") Long id) {
    try {
      ViewersAnalytics viewersAnalytics = analyticsSessionBean.getViewersAnalytics(id);
      return Response.status(200).entity(viewersAnalytics).type(MediaType.APPLICATION_JSON).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  }
}
