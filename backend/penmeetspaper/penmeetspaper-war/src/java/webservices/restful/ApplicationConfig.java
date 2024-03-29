/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import java.util.Set;

/**
 *
 * @author carlc
 */
@javax.ws.rs.ApplicationPath("webresources")
public class ApplicationConfig extends javax.ws.rs.core.Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method. It is automatically
     * populated with all resources defined in the project. If required, comment
     * out calling this method in getClasses().
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(webservices.restful.AccountResource.class);
        resources.add(webservices.restful.AdminLogResource.class);
        resources.add(webservices.restful.AdministratorResource.class);
        resources.add(webservices.restful.AdvertisementResource.class);
        resources.add(webservices.restful.AnalyticsResource.class);
        resources.add(webservices.restful.BankAccountResource.class);
        resources.add(webservices.restful.CORSFilter.class);
        resources.add(webservices.restful.ChatResource.class);
        resources.add(webservices.restful.CommentResource.class);
        resources.add(webservices.restful.CommunityResource.class);
        resources.add(webservices.restful.FollowResource.class);
        resources.add(webservices.restful.MessageResource.class);
        resources.add(webservices.restful.NotificationResource.class);
        resources.add(webservices.restful.PersonResource.class);
        resources.add(webservices.restful.PollResource.class);
        resources.add(webservices.restful.PostResource.class);
        resources.add(webservices.restful.ReplyResource.class);
        resources.add(webservices.restful.ReportResource.class);
        resources.add(webservices.restful.StreamResource.class);
        resources.add(webservices.restful.SubscriptionResource.class);
        resources.add(webservices.restful.TrendResource.class);
        resources.add(webservices.restful.VideoResource.class);
    }
}
