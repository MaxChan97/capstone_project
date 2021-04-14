/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.EarningsAnalytics;
import entity.FollowersAnalytics;
import entity.SiteWideAnalytics;
import entity.SubscribersAnalytics;
import entity.ViewersAnalytics;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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
  @Path("/siteWideAnalytics/onboardingCount")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSiteWideOnboardingAnalytics() {
    SiteWideAnalytics siteWideAnalytics = analyticsSessionBean.getSiteWideAnalytics();
    Map<Long, Long> onboardingMap = new HashMap<>();
    for (Map.Entry<Date, Long> entry : siteWideAnalytics.getOnboardingCount().entrySet()) {
      onboardingMap.put(entry.getKey().getTime(), entry.getValue());
    }
    return Response.status(200).entity(onboardingMap).type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/siteWideAnalytics/followersCount")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSiteWideFollowersAnalytics() {
    SiteWideAnalytics siteWideAnalytics = analyticsSessionBean.getSiteWideAnalytics();
    Map<Long, Long> followersMap = new HashMap<>();
    for (Map.Entry<Date, Long> entry : siteWideAnalytics.getFollowersCount().entrySet()) {
      followersMap.put(entry.getKey().getTime(), entry.getValue());
    }
    return Response.status(200).entity(followersMap).type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/siteWideAnalytics/subscribersCount")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSiteWideSubscribersAnalytics() {
    SiteWideAnalytics siteWideAnalytics = analyticsSessionBean.getSiteWideAnalytics();
    Map<Long, Long> subscribersMap = new HashMap<>();
    for (Map.Entry<Date, Long> entry : siteWideAnalytics.getSubscribersCount().entrySet()) {
      subscribersMap.put(entry.getKey().getTime(), entry.getValue());
    }
    return Response.status(200).entity(subscribersMap).type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/siteWideAnalytics/earnings")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSiteWideEarningsAnalytics() {
    SiteWideAnalytics siteWideAnalytics = analyticsSessionBean.getSiteWideAnalytics();
    Map<Long, Double> earningsMap = new HashMap<>();
    for (Map.Entry<Date, Double> entry : siteWideAnalytics.getRevenue().entrySet()) {
      earningsMap.put(entry.getKey().getTime(), entry.getValue());
    }
    return Response.status(200).entity(earningsMap).type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/siteWideAnalytics/postsCount")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSiteWidePostsAnalytics() {
    SiteWideAnalytics siteWideAnalytics = analyticsSessionBean.getSiteWideAnalytics();
    Map<Long, Long> postsMap = new HashMap<>();
    for (Map.Entry<Date, Long> entry : siteWideAnalytics.getPostsCount().entrySet()) {
      postsMap.put(entry.getKey().getTime(), entry.getValue());
    }
    return Response.status(200).entity(postsMap).type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/siteWideAnalytics/streamsCount")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSiteWideStreamsAnalytics() {
    SiteWideAnalytics siteWideAnalytics = analyticsSessionBean.getSiteWideAnalytics();
    Map<Long, Long> streamsMap = new HashMap<>();
    for (Map.Entry<Date, Long> entry : siteWideAnalytics.getStreamsCount().entrySet()) {
      streamsMap.put(entry.getKey().getTime(), entry.getValue());
    }
    return Response.status(200).entity(streamsMap).type(MediaType.APPLICATION_JSON).build();
  }

  @GET
  @Path("/subscribersAnalytics/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getSubscribersAnalytics(@PathParam("id") Long id) {
    try {
      SubscribersAnalytics subscribersAnalytics = analyticsSessionBean.getSubscribersAnalytics(id);
      Map<Long, Long> map = new HashMap<Long, Long>();
      for (Map.Entry<Date, Long> entry : subscribersAnalytics.getSubscribersCount().entrySet()) {
        map.put(entry.getKey().getTime(), entry.getValue());
      }
      return Response.status(200).entity(map).type(MediaType.APPLICATION_JSON).build();
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
      Map<Long, Long> map = new HashMap<Long, Long>();
      for (Map.Entry<Date, Long> entry : followersAnalytics.getFollowersCount().entrySet()) {
        map.put(entry.getKey().getTime(), entry.getValue());
      }
      return Response.status(200).entity(map).type(MediaType.APPLICATION_JSON).build();
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
      Map<Long, Double> map = new HashMap<Long, Double>();
      for (Map.Entry<Date, Double> entry : earningsAnalytics.getEarnings().entrySet()) {
        map.put(entry.getKey().getTime(), entry.getValue());
      }
      return Response.status(200).entity(map).type(MediaType.APPLICATION_JSON).build();
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
      Map<Long, Long> map = new HashMap<Long, Long>();
      for (Map.Entry<Date, Long> entry : viewersAnalytics.getViewersCount().entrySet()) {
        map.put(entry.getKey().getTime(), entry.getValue());
      }
      return Response.status(200).entity(map).type(MediaType.APPLICATION_JSON).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  }
}
