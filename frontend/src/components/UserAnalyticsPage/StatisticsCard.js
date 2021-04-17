import React from "react";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

export default function StatisticsCard({
  title,
  currentStat,
  prevStat,
  isCurrency,
}) {
  let percentage = (100 * Math.abs(currentStat - prevStat)) / prevStat;

  return (
    <div class="card">
      <div class="card-body">
        <div class="container">
          <div class="row">
            <h6 class="card-text text-muted">{title}</h6>
          </div>
          <div class="row mt-2">
            <h4 class="card-text">
              {isCurrency ? "$" : ""}
              {currentStat}
            </h4>
          </div>
          <div class="row mt-2">
            <div class="col-3 p-0">
              {currentStat >= prevStat ? (
                <ArrowUpwardIcon style={{ color: "green" }} />
              ) : (
                <ArrowDownwardIcon color="secondary" />
              )}
            </div>
            <div class="col-9">
              <h4 class="card-text">
                {isFinite(percentage) ? percentage : 0}%
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
