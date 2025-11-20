// --- پروفایل ---
function saveProfile(){
    let first = document.getElementById('firstName').value.trim();
    let last = document.getElementById('lastName').value.trim();
    if(!first || !last){ alert('نام و نام خانوادگی را وارد کنید'); return; }
    localStorage.setItem('firstName', first);
    localStorage.setItem('lastName', last);
}

// --- تعریف مجموعه‌ها ---
function convertCondition(cond){
  return cond.replace(/بزرگتر مساوی/gi,"≥")
             .replace(/کوچکتر مساوی/gi,"≤")
             .replace(/بزرگتر/gi,">")
             .replace(/کوچکتر/gi,"<")
             .replace(/مساوی/gi,"=")
             .replace(/و/gi,",");
}

function makeExpression(){
  let set = document.getElementById("knownSet").value;
  let cond = document.getElementById("textCondition").value.trim();
  if(!set){ alert("لطفاً یک مجموعه انتخاب کنید"); return;}
  if(!cond){ alert("لطفاً شرط را وارد کنید"); return;}
  let expression = `{ x ∈ ${set} | ${convertCondition(cond)} }`;
  document.getElementById("mathResult").innerText = expression;
}

function showMembers(){
  let set = document.getElementById("knownSet").value;
  let box = document.getElementById("membersBox");
  if(set==="N"){box.innerText="{1,2,3,...}";}
  else if(set==="Z"){box.innerText="{..., -2,-1,0,1,2,...}";}
  else if(set==="W"){box.innerText="{0,1,2,3,...}";}
  else{box.innerText="نمایش اعضا برای این مجموعه امکان‌پذیر نیست.";}
}

function showVenn(){
    const canvas = document.getElementById("vennCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let set = document.getElementById("knownSet").value;
    let cond = document.getElementById("textCondition").value.trim();
    let rangeMembers = [];
    if((set==="N" || set==="Z" || set==="W") && cond){
        let numbers = cond.match(/\d+/g);
        if(numbers && numbers.length>=2){
            let start=parseInt(numbers[0]), end=parseInt(numbers[1]);
            if(set==="N" && start<1) start=1;
            for(let i=start;i<=end;i++) rangeMembers.push(i);
        } else { ctx.font="18px Tahoma"; ctx.fillStyle="red"; ctx.fillText("نمایش نمودار امکان‌پذیر نیست چون مجموعه نامتناهی یا بدون پایانه است.",20,50); return; }
    } else if(set==="Q"||set==="I"||set==="R"){ ctx.font="18px Tahoma"; ctx.fillStyle="red"; ctx.fillText("نمایش نمودار امکان‌پذیر نیست چون عضو گویا، گنگ یا حقیقی است.",20,50); return; }
    else { ctx.font="18px Tahoma"; ctx.fillStyle="red"; ctx.fillText("نمایش نمودار امکان‌پذیر نیست چون مجموعه نامتناهی یا بدون پایانه است.",20,50); return; }

    let cx=canvas.width/2, cy=canvas.height/2, r=50, angle=0;
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.arc(cx,cy,r*angle/100,0,2*Math.PI*angle/100);
        ctx.strokeStyle="blue";
        ctx.lineWidth=3;
        ctx.stroke();
        angle++;
        if(angle<=100) requestAnimationFrame(animate);
        else showMembersInVenn();
    }
    animate();
    function showMembersInVenn(){
        ctx.font="16px Tahoma";
        ctx.fillStyle="black";
        let angleStep = 2*Math.PI/rangeMembers.length;
        rangeMembers.forEach((num,i)=>{
            let x=cx+r*Math.cos(i*angleStep-Math.PI/2);
            let y=cy+r*Math.sin(i*angleStep-Math.PI/2);
            ctx.fillText(num,x-5,y+5);
        });
    }
}

function showAxis(){
    const canvas=document.getElementById("axisCanvas");
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let set=document.getElementById("knownSet").value;
    if(set==="Q"||set==="I"||set==="R"){ ctx.font="18px Tahoma"; ctx.fillStyle="red"; ctx.fillText("نمایش محور امکان‌پذیر نیست",20,50); return; }
    let startX=50,endX=canvas.width-50,y=100;
    ctx.beginPath(); ctx.moveTo(startX,y); ctx.lineTo(endX,y); ctx.strokeStyle="black"; ctx.lineWidth=2; ctx.stroke();
    [-5,-4,-3,-2,-1,0,1,2,3,4,5].forEach((num,i)=>{ ctx.beginPath(); ctx.arc(startX+i*30,y,8,0,2*Math.PI); ctx.fillStyle="black"; ctx.fill(); });
}

// --- عملیات ریاضی ---
function handleDisplayChange(){
    const displayType=document.getElementById('displayType').value;
    const knownSetSelect=document.getElementById('knownSetSelect');
    const memberBox=document.getElementById('memberBox');
    if(displayType==='knownSet'){ knownSetSelect.classList.remove('hidden'); memberBox.innerText=''; }
    else { knownSetSelect.classList.add('hidden'); memberBox.innerText=''; }
}

function showOperations(){
    const displayType=document.getElementById('displayType').value;
    const knownSetSelect=document.getElementById('knownSetSelect').value;
    const operation=document.getElementById('operationSelect').value;
    const memberBox=document.getElementById('memberBox');
    let A_math="{ x ∈ A | x ≥ 1 }";
    let knownSet_math='';
    if(displayType==='math'){ memberBox.innerText=A_math; return; }
    if(displayType==='list'){ memberBox.innerText="{1,2,3,...}"; return; }
    if(displayType==='knownSet'){
        if(!knownSetSelect){ alert("لطفاً یک مجموعه شناخته شده انتخاب کنید!"); return; }
        let canShowMembers=false;
        switch(knownSetSelect){
            case 'N': knownSet_math="{1,2,3,...}"; canShowMembers=true; break;
            case 'W': knownSet_math="{0,1,2,3,...}"; canShowMembers=true; break;
            case 'Z': knownSet_math="{..., -2,-1,0,1,2,...}"; canShowMembers=true; break;
            case 'Q': knownSet_math="اعداد گویا (نمایش نمودار/اعضا امکان‌پذیر نیست)"; break;
            case 'I': knownSet_math="اعداد گنگ (نمایش نمودار/اعضا امکان‌پذیر نیست)"; break;
            case 'R': knownSet_math="اعداد حقیقی (نمایش نمودار/اعضا امکان‌پذیر نیست)"; break;
        }
        let result='';
        switch(operation){
            case 'union': result=`A ∪ ${knownSet_math}`; break;
            case 'intersection': result=`A ∩ ${knownSet_math}`; break;
            case 'difference': result=`A \\ ${knownSet_math}`; break;
            case 'subset': result=`A ⊆ ${knownSet_math} ?`; break;
        }
        if(!canShowMembers && (knownSetSelect==='Q'||knownSetSelect==='I'||knownSetSelect==='R')){
            memberBox.innerText="نمایش اعضا یا نمودار امکان‌پذیر نیست چون نامتناهی یا غیرقابل نمایش است.";
        } else { memberBox.innerText=result; }
    }
}
