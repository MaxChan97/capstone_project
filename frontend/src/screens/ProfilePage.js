import React, { useState } from "react";
import { useHistory, Redirect, useParams } from "react-router";
import { useSelector } from "react-redux";
import OwnProfilePage from "./OwnProfilePage";
import AnotherProfilePage from "./AnotherProfilePage";

export default function ProfilePage() {
  const { personId } = useParams();

  const currentUser = useSelector((state) => state.currentUser);
  if (currentUser === null) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {personId == currentUser.id ? (
        <OwnProfilePage personId={personId} />
      ) : (
        <AnotherProfilePage personId={personId} />
      )}
    </div>
  );
}
