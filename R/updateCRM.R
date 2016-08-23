
#' updateModel
#'
#' This updates the tite-crm
#'
#' @param target target toxicity level
#' @param prior prior guess for each dose
#' @param data the data to update the model with
#'
#' @import opencpu
#' @import dfcrm
updateModel = function(target, prior, data) {

  ln=length(prior)

  target = as.numeric(target)
  level <- data$x
  y <- data$y
  weights = data$weights
  foo <- titecrm(prior, target, y, level, weights = weights)
  print(foo)
  return(list(estimate = foo$estimate, mtd = foo$mtd, ptox = data.frame(x=1:ln,y=foo$ptox), ptoxL = data.frame(x=1:ln,y=foo$ptoxL), ptoxU = data.frame(x=1:ln,y=foo$ptoxU)))
}
