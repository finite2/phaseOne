


# Define server logic for random distribution application
library(shiny)
library(shinyjs)


shinyServer(function(input, output){
  useShinyjs(html = TRUE)
  extendShinyjs(script = "www/js/rjs.js")
  
  observe({
    if(!is.null(input$button)){
      if(input$button > 0){
        isolate({
          js$addPatients(10)
        })
      }
    }
  })
  
  
})