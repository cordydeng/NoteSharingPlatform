package controller;

import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.json.*;

import app.Admin;
import app.AdminHelper;
import app.NoteHelper;
import app.UserHelper;
import tools.JsonReader;

// TODO: Auto-generated Javadoc
/**
 * <p>
 * MemberController類別（class）主要用於處理Member相關之Http請求（Request），繼承HttpServlet
 * </p>
 * 
 * @author IPLab
 * @version 1.0.0
 * @since 1.0.0
 */
@WebServlet("/api/Admin.do")
public class AdminController extends HttpServlet {
    private AdminHelper AH =  AdminHelper.GetAdminHelper();
    private UserHelper UH = UserHelper.GetUserHelper();
    private NoteHelper NH=NoteHelper.GetNoteHelper();
    /**
     * 處理Http Method請求POST方法（新增資料）
     *
     * @param request Servlet請求之HttpServletRequest之Request物件（前端到後端）
     * @param response Servlet回傳之HttpServletResponse之Response物件（後端到前端）
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        JsonReader jsr = new JsonReader(request);
        JSONObject jso = jsr.getObject();
        String Account = jso.getString("Account");
        String Password = jso.getString("Password");
        //判斷登入或註冊
        int instruction=jso.getInt("Instruction");
        Admin admin = new Admin(Account, Password);
        /** 後端檢查是否有欄位為空值，若有則回傳錯誤訊息 */
        if(instruction==1)
        {
        	if(!AH.LoginCheck(Account,Password)){
                String resp = "{\"status\": \'400\', \"message\": \'帳號或密碼錯誤\', \'response\': \'\'}";
                jsr.response(resp, response);
            }
            else{
            	String resp="";
            		resp="{\"status\": \'200\', \"message\": \'登入成功\', \'response\': \'\'}";
                jsr.response(resp, response);
            }
        }
        else
        {
        	if(Account.isEmpty() || Password.isEmpty() ) {
                String resp = "{\"status\": \'400\', \"message\": \'欄位不能有空值\', \'response\': \'\'}";
                jsr.response(resp, response);
            }
            /** 透過MemberHelper物件的checkDuplicate()檢查該會員電子郵件信箱是否有重複 */
            else if (AH.CheckAccount(admin)) {
                JSONObject data = AH.CreateAdmin(admin);
                
                JSONObject resp = new JSONObject();
                resp.put("status", "200");
                resp.put("message", "成功! 註冊會員資料...");
                resp.put("response", data);
                jsr.response(resp, response);
            }
            else {
                String resp = "{\"status\": \'400\', \"message\": \'新增帳號失敗，此帳號重複！\', \'response\': \'\'}";
                jsr.response(resp, response);
            }
        }
        
    }

    /**
     * 處理Http Method請求GET方法（取得資料）
     *
     * @param request Servlet請求之HttpServletRequest之Request物件（前端到後端）
     * @param response Servlet回傳之HttpServletResponse之Response物件（後端到前端）
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        JsonReader jsr = new JsonReader(request);
        // 應該會有檢視管理員及檢視會員兩個資料，按下後傳給data
        // output=帳號、名字
        int instruction = Integer.parseInt(jsr.getParameter("instruction"));        
        if (instruction==1) {
            // 檢視所有管理員
            JSONObject query = AH.GetAdmin();            
            JSONObject resp = new JSONObject();
            resp.put("status", "200");
            resp.put("message", "所有管理員資料取得成功");
            resp.put("response", query);
            jsr.response(resp, response);
        }
        else if(instruction==2){
            // 檢視所有用戶
            JSONObject query = UH.GetUser();            
            JSONObject resp = new JSONObject();
            resp.put("status", "200");
            resp.put("message", "所有用戶資料取得成功");
            resp.put("response", query);
            jsr.response(resp, response);
        }
        else {
        	JSONObject query = NH.GetNote();            
            JSONObject resp = new JSONObject();
            resp.put("status", "200");
            resp.put("message", "所有筆記資料取得成功");
            resp.put("response", query);
            jsr.response(resp, response);
        }
    }

    /**
     * 處理Http Method請求DELETE方法（刪除）
     *
     * @param request Servlet請求之HttpServletRequest之Request物件（前端到後端）
     * @param response Servlet回傳之HttpServletResponse之Response物件（後端到前端）
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public void doDelete(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
        JsonReader jsr = new JsonReader(request);
        JSONObject jso = jsr.getObject();
        
        String Account = jso.getString("Account");
        JSONObject query = AH.DeleteAdmin(Account);
        JSONObject resp = new JSONObject();
        resp.put("status", "200");
        resp.put("message", "管理員移除成功！");
        resp.put("response", query);
        jsr.response(resp, response);
    }

    /**
     * 處理Http Method請求PUT方法（更新）
     *
     * @param request Servlet請求之HttpServletRequest之Request物件（前端到後端）
     * @param response Servlet回傳之HttpServletResponse之Response物件（後端到前端）
     * @throws ServletException the servlet exception
     * @throws IOException Signals that an I/O exception has occurred.
     */
    public void doPut(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        JsonReader jsr = new JsonReader(request);
        JSONObject jso = jsr.getObject();
        String Account = jso.getString("Account");
        String Password = jso.getString("Password");

        Admin admin = new Admin(Account, Password);
        JSONObject data = AH.UpdateAdmin(admin);
        
        JSONObject resp = new JSONObject();
        resp.put("status", "200");
        resp.put("message", "成功! 更新管理員資料...");
        resp.put("response", data);
        
        jsr.response(resp, response);
    }
}