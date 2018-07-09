$(function(){
	var i=$(".cang img").attr('src');
	var i1="images"+"/"+"gh_09"+".jpg";
	var i2="images"+"/"+"gh_13"+".jpg";
	$(".cang").click(function(){
		if($(this).find("img").attr('src')==i1){
		  $(this).find("img").attr({'src':i2})
		  $(this).find("span").text("收藏")
		}
		else{
		  $(this).find("img").attr({'src':i1})
		  $(this).find("span").text("未收藏")
			}
	})
	$(".sheng").click(function(){
		$(".qi").after("<div class='box box2'></div>");
		$(".box").animate({opacity:1},300,function(){
			$(".qi").fadeIn(100)
			})
		$(".qi button,.box").click(function(){
			$(".qi").fadeOut(100,function(){
				$(".box").animate({opacity:0},300)
				})
			$(".box").detach();
			})	
		})
	$(".shengt").each(function(t) {
        $(this).click(function(){
		$(".qit").after("<div class='box box2'></div>");
		$(".box").animate({opacity:1},300,function(){
			$(".qi").eq(t).fadeIn(100)
			})
		$(".qi button,.box").click(function(){
			$(".qi").fadeOut(100,function(){
				$(".box").animate({opacity:0},300)
				})
			$(".box").detach();
			})	
			})
    });	
	var b=$(".radio img").attr('src');
	var b1="images"+"/"+"jin_06"+".jpg";
	var b2="images"+"/"+"jin_10"+".jpg";
	$(".radio").click(function(){
		if($(this).find("img").attr('src')==b1){
		  $(this).find("img").attr({'src':b2});
		  $(this).find("input").attr("checked", true);
		}
		else{
		  $(this).find("img").attr({'src':b1})
		  $(this).find("input").attr("checked", false);
			}
	})
	$(".ra_all").click(function(){
		if($(".ra_all img").attr('src')==b2&&$(".ra_all input").attr("checked", true)){
		  $(".radio img").attr({'src':b2})
			}
		  else{
			 $(".radio img").attr({'src':b1})
			  }
	})

	$(".waa .c_rde").each(function(i) {
        $(this).click(function(){
			$(".waa .c_rde").removeClass("cheng");
			$(".waa .c_rde").text("设为默认");
			$(".c_rde").eq(i).text("默认");
			$(".waa .c_rde").eq(i).addClass("cheng");
			})
    });
	$(".waa .rde").each(function(i) {
		$(this).click(function(){
			$(".waa .rde img").attr({"src":"images/d_06.jpg"})
			$(this).find("img").attr({"src":"images/d_03.jpg"});
			})
    });
	$(".detail_t li").each(function(i) {
        $(this).click(function(){
			$(".detail_t li").eq(i).addClass("hover").siblings(".detail_t li").removeClass("hover");
			$(".detail_q").eq(i).fadeIn().siblings(".detail_q").fadeOut(0);
			})
    }).eq(0).trigger("click");
	$(".fabu li").each(function(i) {
        $(this).click(function(){
			$(".fabu li").eq(i).addClass("hover").siblings(".fabu li").removeClass("hover");
			$(".xq").eq(i).fadeIn().siblings(".xq").fadeOut(0);
			})
    }).eq(0).trigger("click");
	$(".add").click(function() {
		$(this).prev().val(parseInt($(this).prev().val())+1)
	});
	$(".gong li").each(function(i) {
        $(this).click(function(){
			$(".gong_content").eq(i).fadeIn().siblings(".gong_content").fadeOut(0);
			$(this).addClass("gong_hover").siblings(".gong li").removeClass("gong_hover");
			})
    }).eq(0).trigger("click");
	var wh=$(".img_w img").width();
	$(".img_w").width({"width":wh});
//	$(".zhanshi li").each(function(t){
//        $(this).click(function(){
//		$(".xiang_fen").eq(t).fadeToggle(300);
//		$(".boxt").fadeToggle(300);
//		})	
//    });
	$(".xiang_ff .grey li").each(function(t) {
        $(this).click(function(){
			$(this).addClass("hover").siblings(".xiang_ff .grey li").removeClass("hover");
			$(".quan").eq(t).fadeIn(300).siblings(".quan").fadeOut(0);
			})
    }).eq(0).trigger("click");
	$(".zhanshi li").each(function(t){
		$(".w_100").after("<div class='box'></div>");
		$(this).click(function(){
			$(".box").animate({opacity:1},300,function(){
				$(".xiang_fen").eq(t).fadeIn(200).siblings(".xiang_fen").fadeOut(0);
				$(".zhanshi li img").attr({"src":"images/ew_06.jpg"});
				$(".zhanshi li img").eq(t).attr({"src":"images/wr_03.jpg"});
				$(".zhanshi li").eq(t).addClass("cheng").siblings(".zhanshi li").removeClass("cheng");
			})
		})
		$(".box").click(function(){
			$(".xiang_fen").eq(t).fadeOut(200);
			$(".box").animate({opacity:0},300);
		})
    });
	$(".h_xuan").each(function(i){
       $(this).click(function(){
		   $(this).addClass("h_huang").siblings(".h_xuan").removeClass("h_huang");
		   })  
    });
	$(".min").click(function() {
		$(this).next().val(parseInt($(this).next().val())-1)
	});
	$(".jia_bottom li").each(function(t) {
	  	$(this).click(function(){
			$(".jia_bottom").after("<div class='box box2'></div>");
			$(".box").animate({opacity:1},300,function(){
				$(".jia_content").eq(t).animate({bottom:0},300);
				})
			$(".box,.close_content").click(function(){
				$(".jia_content").animate({bottom:'-100%'},300,function(){
					$(".box").animate({opacity:0},300);
					})
				$(".box").detach();	
				})	
		})		
    });
	  	$(".jia_bottom dt").click(function(){
			$(".lan").after("<div class='box box2'></div>");
			$(".box").animate({opacity:1},300,function(){
				$(".jia_content").animate({bottom:0},300);
				})
			$(".box,.close_content").click(function(){
				$(".jia_content").animate({bottom:'-100%'},300,function(){
					$(".box").animate({opacity:0},300);
					})
				$(".box").detach();	
				})	
		})		
	
	$(".xia").click(function(){
		$(".jia_content").eq(0).animate({bottom:'-100%'},300);
		$(".jia_content").eq(1).animate({bottom:0},0);
	})

	$(".set").click(function(){
		$(".boss").after("<div class='box'></div>");
		$(".box").animate({opacity:1},300,function(){
			$(".boo").fadeIn(200);
			})
		$(".box").click(function(){
			$(".boo").fadeOut(200,function(){
				$(".box").animate({opacity:0},200)
				})
			$(".box").detach();	
			})
		})
	$(".shai_set").click(function(){
		$(".shai").after("<div class='box box2'></div>");
		$(".box").animate({opacity:1},300,function(){
			$(".shai").animate({right:0},300);
			})
		$(".box,.seta").click(function(){
			$(".shai").animate({right:'-100%'},300,function(){
				$(".box").animate({opacity:0},300);
				})
			$(".box").detach();	
			})	
		})		
	$(".click").click(function(){
		$("body,html").animate({scrollTop:0},600)
		})
	$(".lan li").each(function(i){
		var ht=$(".lan li img").height()/2;
		$(".lan li h1").css({"height":ht})
		$(".lan li.hover h1 img").css({"top":-ht,"position":'relative'})
        $(this).click(function(){
			$(".lan li").removeClass("hover");
			$(".lan li").eq(i).addClass("hover")
			$(".lan li h1 img").css({"top":0,"position":'relative'})
			$(".lan li.hover h1 img").css({"top":-ht,"position":'relative'})
			})
    });
	})	
$(window).resize(function(){
	$(".lan li").each(function(i){
		var ht=$(".lan li img").height()/2;
		$(".lan li h1").css({"height":ht})
		$(".lan li.hover h1 img").css({"top":-ht,"position":'relative'})
        $(this).click(function(){
			$(".lan li").removeClass("hover");
			$(".lan li").eq(i).addClass("hover")
			$(".lan li h1 img").css({"top":0,"position":'relative'})
			$(".lan li.hover h1 img").css({"top":-ht,"position":'relative'})
			})
    });	
	})	
$(window).load(function(){
	$(".lan li").each(function(i){
		var ht=$(".lan li img").height()/2;
		$(".lan li h1").css({"height":ht})
		$(".lan li.hover h1 img").css({"top":-ht,"position":'relative'})
        $(this).click(function(){
			$(".lan li").removeClass("hover");
			$(".lan li").eq(i).addClass("hover")
			$(".lan li h1 img").css({"top":0,"position":'relative'})
			$(".lan li.hover h1 img").css({"top":-ht,"position":'relative'})
			})
    });	
	})		