var width = 1200, height = 600;
//set the dimensions and margins of the graph
var margin = {top:100, right:30, bottom:30, left:30};

var xCenter = [240, 480, 600, 720, 960];
var circleRadius = 2.4; 

// statement list
const statements = [
    {
        "code":"fewer_quota_refugees",
        "year":"2023",
        "statement":"Finland should accept fewer quota refugees from refugee camps."
    },
    {
        "code":"labour_immigration_needed",
        "year":"2023",
        "statement":"Labour immigration is needed to sustain the Finnish welfare society."
    },
    {
        "code":"no_availability_test",
        "year":"2023",
        "statement":"Businesses must have the freedom to hire workers from outside the EU without an availability test."
    },
    {
        "code":"deport_crimes_easily",
        "year":"2023",
        "statement":"Finland must be able to deport immigrants who commit crimes more easily than at present."
    }
]
console.table(statements);

// add statement to the dropdown menu selection
d3.select("#selectButton")
    .selectAll("myOptions")
        .data(statements)
    .enter()
        .append("option")
    .text(function (d) { return d.statement; }) 
    .attr("value", function (d) { return d.statement; }) 

var svg = d3.select("#candidate_plot")
    .append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(0"+","+height/2+")");

plot(statements[0].statement);

//when the button is changed, update the plot
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    plot(selectedOption)
})

function plot(selectedOption){
    console.log(selectedOption);
    svg.selectAll("*").remove();

    d3.json("./data/candidate-answers-2023.json").then(function(data){

        var simulation = d3.forceSimulation(data)
            .force('charge', d3.forceManyBody().strength(1))
            .force('x', d3.forceX().x(function(d) {
                var scatterX;
                switch(selectedOption) {
                    case statements[0].statement:
                        // console.log(d.fewer_quota_refugees + " " + xCenter[d.fewer_quota_refugees-1]);
                        scatterX = xCenter[d.fewer_quota_refugees-1];
                        break;
                    case statements[1].statement:
                        scatterX = xCenter[d.labour_immigration_needed-1];
                        break;
                    case statements[2].statement:
                        scatterX = xCenter[d.no_availability_test-1];
                        break;
                    case statements[3].statement:
                        scatterX = xCenter[d.deport_crimes_easily-1];
                        break;
                }
                console.log(scatterX);
                return scatterX;       
            }))
            .force('collision', d3.forceCollide().radius(circleRadius))
            .on('tick', ticked);
    
        function ticked() {
            svg.selectAll('circle')
                .data(data)
                .join('circle')
                .attr('r', circleRadius)
                .attr('class', function(d){
                    return d.party;
                })
                .attr('cx', function(d){
                    return d.x;
                })
                .attr('cy', function(d){
                    return d.y;
                });
        }
    })

}