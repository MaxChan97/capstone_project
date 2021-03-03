/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import owner from "../../assets/Owned.svg";
import { useSelector} from "react-redux";

export default function MyCommunitiesRow({community}) {
    const currentUser = useSelector((state) => state.currentUser);

    return (
        <div className="container">
        <div className="row">
            <div className="col-md-1 mr-2">
            <img 
            style={{
                resizeMode: "repeat",
                height: 50,
                width: 50,
                borderRadius: "50%",
                display: "block"
            }}
            className="img-fluid" src={community.communityProfilePicture} alt="Community Picture"/>
            </div>
            <div className="col-md-3">
                <p className="text-left">
                    {community.name}<br/>
                    <small>{community.members.length} Members</small>
                </p>
            </div>
            <div className="col-md-6">
            <p className="text-left">{community.description}</p>
            </div>
            <div className="col-md-1">
                {community.owner === currentUser ? (
                    <img 
                    style={{
                        float: "right",
                        margin: "10px 0px"}}
                    src={owner} alt="Owner Logo" />
                    ) :
                    (null)}
            </div>
        </div>
    </div>
  );
}
